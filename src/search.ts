import RemarkMathPlugin from 'remark-math';
import remark from 'remark';
import strip from 'strip-markdown';
import natural from 'natural';
import contractions from 'expand-contractions';
import { ID } from './model';

/** Associates each word to a number of occurrences in the corpus */
export type WordVector = { [key: string]: number }

/**
 * Associates each card ID with the number of times a token occurs in that card.
 */
export type Occurrences = { [key: string]: number }

/** 
 * Associates each word to the set of cards that contain it
 * and the number of occurrences in that card.
 */
export type Index = { [key: string]: Occurrences }

export function newIndex(): Index {
    return {};
}

/**
 * Given some markdown text, return a version of that text minus formatting.
 * @param text 
 */
export async function removeFormatting(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    remark()
      .use(RemarkMathPlugin)
      .use(strip)
      .process(text, function (err, file) {
        if (err) reject(err);
        else resolve(String(file));
      })
  });
}

/**
 * Normalizes, tokenizes, removes stop words, and stems the given string.
 * @param text A plain text string
 */
export function getFeatures(text: string): WordVector {
  const expandedText = contractions.expand(text);
  const tokens = natural.PorterStemmer.tokenizeAndStem(expandedText);
  const vec: WordVector = {};
  for (const token of tokens) {
      vec[token] = vec[token] === undefined ? 1 : vec[token] + 1;
  }
  // Normalize
  for (const token of Object.keys(vec)) {
      vec[token] = vec[token] / tokens.length
  }
  return vec;
}

function addVecToIndex(id: ID, vec: WordVector, index: Index) {
    for (const [token, count] of Object.entries(vec)) {
        if (index[token] === undefined) {
            index[token] = {};
        }
        index[token][id] = count;
    }
}

function removeVecFromIndex(id: ID, vec: WordVector, index: Index) {
    for (const token of Object.keys(vec)) {
        if (index[token] !== undefined) {
            console.log("Deleting", token, "with count", index[token][id])
            delete index[token][id]
        }
    }
}

export async function addToIndex(id: ID, contents: string, index: Index) {
    const text = await removeFormatting(contents)
    const features = getFeatures(text)
    addVecToIndex(id, features, index);
}

export async function removeFromIndex(id: ID, contents: string, index: Index) {
    const text = await removeFormatting(contents)
    const features = getFeatures(text)
    removeVecFromIndex(id, features, index);
}

/**
 * Computes the similarity of two vectors v1, v2 by taking the dot product.
 * @return A number between 0 and 1; higher is more similar
 */
function cosineSimilarity(vec1: WordVector, vec2: WordVector): number {
    let numerator = 0
    // Note that we only need to iterate over the keys of *one* of the vectors
    for (const token of Object.keys(vec1)) {
        numerator += (vec1[token] || 0) * (vec2[token] || 0)
    } 
    // Since we know both vectors are normalized, the denominator is 1
    return numerator;
}

/**
 * Computes the similarity between its inputs.
 * This function is similar to `cosineSimilarity`, but we make sure that
 * a note that matches N keywords always outranks a note matching M < N keywords
 */
function rankedCosineSimilarity(vec1: WordVector, vec2: WordVector): number {
    let intersectCount = 0
    for (const token of Object.keys(vec1)) {
        if (Object.keys(vec2).includes(token)) {
            intersectCount += 1
        }

    }
    return intersectCount + cosineSimilarity(vec1, vec2)
}

export function search(queryString: string, index: Index): ID[] {
    const query = getFeatures(queryString);
    if (Object.keys(query).length == 0) return [];

    // We now reconstruct a projection of each document's word vector, only
    // counting the words that are already in our query.

    // E.g., query = {additive: 0.5, monad: 0.5} and
    // index = { additive: {"doc": 0.2, ...}, monad: {"doc": 0.5, ...}, ... }
    // then documents["doc"] = {additive: 0.2, monad: 0.5}.
    const documents: Map<ID, WordVector> = new Map();
    for (const token of Object.keys(query)) {
        const occurrences = index[token] || {}
        for (const [id, weight] of Object.entries(occurrences)) {
            const vec = documents.get(id) || {};
            vec[token] = weight;
            documents.set(id, vec)
        }
    }
    // console.log("Reconstructed vectors:", documents)

    // Assign each ID with a similarity score
    const similarity: [ID, number][] = []
    for (const [id, vec] of documents.entries()) {
        similarity.push([id, rankedCosineSimilarity(query, vec)])
    }
    // Sort by score, descending
    similarity.sort((a,b) => b[1] - a[1])
    // console.log("Similarity scores:", similarity)

    return similarity.map(([id, _]) => id).slice(0,50)
}