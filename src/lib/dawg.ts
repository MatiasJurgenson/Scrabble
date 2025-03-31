
// https://github.com/OlgaP21/scrabble-like-game-est/blob/main/public/logic/dictionary.mjs
// Olga Puksberg-i javascripti kood ümbermuudetud typescripti

class Node {
    letter: string;
    isEnd: boolean;
    children: { [key: string]: Node };
        
    constructor(letter: string) {
        this.letter = letter;
        this.isEnd = false;
        //this.counter = 0
        this.children = {};
    }
}

class Trie {
    root: Node;
    constructor() {
        this.root = new Node('');
    }

    /**
     * Funktsioon sõna lisamiseks
     * word - Lisatav sõna
     */
    insert(word: string) {
        var node = this.root;
        for (let letter of word) {
            if (letter in node.children) {
                node = node.children[letter];
            } else {
                var child = new Node(letter);
                node.children[letter] = child;
                node = child;
            }
        }
        node.isEnd = true;
    }

    /**
     * Funktsioon sõna leidmise kontrollimiseks puust
     * word - Otsiatav sõna
     * Tagastab sõna olemasolu puus
     */
    find(word: string): boolean {
        var node = this.root;
        for (let letter of word) {
            if (letter in node.children) {
                node = node.children[letter];
            } else {
                return false;
            }
        }
        return node.isEnd;
    }
}

export type AITrie = InstanceType<typeof Trie>;
export let dictionary: Trie;

export function initDictionary(sõnastik: string[]) {
    dictionary = new Trie();

    for (let sõna of sõnastik) {
        sõna = sõna.toUpperCase();
        dictionary.insert(sõna);
    }
}
