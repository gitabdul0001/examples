import { dbTexts } from './typewriter-text/db'

export async function initializeTexts() {
  const date = new Date();
  await dbTexts.insertMany([{
    text: `First we thought the PC was a calculator. Then we found out how to turn numbers into letters with ASCII - and we thought it was a typewriter. Then we discovered graphics, and we thought it was a television. With the World Wide Web, we've realized it's a brochure.`,
    addedDate: date,
  }, {
    text: `You want to be fooled. But you wouldn't clap yet. Because making something disappear isn't enough; you have to bring it back. That's why every magic trick has a third act, the hardest part, the part we call "The Prestige".`,
    addedDate: date,
  }, {
    text: `The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.`,
    addedDate: date,
  }]);
}
