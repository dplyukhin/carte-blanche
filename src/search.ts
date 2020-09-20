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

// /**
//  * Gets a sorted list of IDs 
//  */
// export function get(token: string, index: Index): ID[] {
//     const occurrences = index[token]
//     return Object.entries(occurrences)
//         .sort((e1, e2) => e2[1] - e1[1])
//         .map(([s, _]) => s)
// }