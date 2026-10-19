import "dotenv/config";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { db, databaseProvider } from "../src/db/index";
import { seedLibrary, listGames, insertLearner, updateLearner, findLearner, setFavorite, listFavorites, saveAttempt, listAttempts, saveUploadedGame, getAsset, updateGame, deleteGame, getGame } from "../src/db/repository";
import { sql } from "drizzle-orm";
async function run() {
  await seedLibrary(); const games = await listGames(); assert.equal(games.filter(g => g.subject === "bangla").length, 8);
  const learner = await insertLearner();
  try {
    await updateLearner(learner.id, { name: "পরীক্ষা", age: 7, dailyGoal: 20 }); assert.equal((await findLearner(learner.id))?.dailyGoal, 20);
    await setFavorite(learner.id, "bangla-vowels", true); await setFavorite(learner.id, "bangla-vowels", true); assert.equal((await listFavorites(learner.id)).length, 1);
    await saveAttempt({ learnerId: learner.id, gameId: "bangla-vowels", correct: 5, total: 5, stars: 3, duration: 60 }); assert.equal((await listAttempts(learner.id))[0].stars, 3);
    const id = randomUUID(); const game = { ...games[0], id, title: "Storage test", kind: "upload" as const, entryPath: "index.html", featured: false };
    await saveUploadedGame(game, [{ gameId: id, path: "index.html", content: Buffer.from("<h1>Test</h1>").toString("base64"), contentType: "text/html", size: 13 }]); assert.ok((await getAsset(id, "index.html"))?.published);
    await updateGame(id, { published: false }); assert.equal((await getGame(id))?.published, false);
    await setFavorite(learner.id, id, true); await deleteGame(id); assert.equal(await getAsset(id, "index.html"), null); assert.equal((await listFavorites(learner.id)).includes(id), false);
    console.log(`PASS ${databaseProvider}: catalog, profile, bookmark deduplication, attempts, uploaded assets, editing, transactional deletion`);
  } finally { await db.execute(sql`DELETE FROM attempts WHERE learner_id=${learner.id}`); await db.execute(sql`DELETE FROM favorites WHERE learner_id=${learner.id}`); await db.execute(sql`DELETE FROM learners WHERE id=${learner.id}`); }
}
run().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
