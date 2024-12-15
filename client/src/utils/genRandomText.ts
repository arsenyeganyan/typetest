function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomSentence(): string {
    const adjectives = ["quick", "lazy", "funny", "mysterious", "brave"];
    const nouns = ["fox", "dog", "cat", "wizard", "warrior"];
    const verbs = ["jumps", "runs", "sleeps", "fights", "dances"];
    const adverbs = ["quickly", "silently", "gracefully", "wildly", "courageously"];
    const prepositions = ["over", "under", "beside", "through", "around"];
    const articles = ["the", "a", "an"];

    const sentence = `${getRandomElement(articles)} ${getRandomElement(adjectives)} ${getRandomElement(nouns)} ${getRandomElement(verbs)} ${getRandomElement(adverbs)} ${getRandomElement(prepositions)} ${getRandomElement(articles)} ${getRandomElement(adjectives)} ${getRandomElement(nouns)}.`;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export function generateRandomParagraph(sentenceCount: number): string {
    let paragraph = "";
    for (let i = 0; i < sentenceCount; i++) {
        paragraph += generateRandomSentence() + " ";
    }
    return paragraph.trim();
}