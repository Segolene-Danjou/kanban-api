BEGIN;


DROP TABLE IF EXISTS "list",
"card",
"tag",
"card_has_tag";

CREATE TABLE IF NOT EXISTS "list" (

    "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "card" (
    "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#dedede',
    "list_id" INT NOT NULL REFERENCES "list"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "tag" (
    "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#fff',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "card_has_tag" (
    "card_id" INT NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
    "tag_id" INT NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("card_id", "tag_id")
);

INSERT INTO
    "list" ("id", "name")
VALUES
    (1, 'Première liste'),
    (2, 'Deuxième liste');

INSERT INTO
    "card" ("id", "content", "color", "list_id")
VALUES
    (1, 'Carte 1', '#f0f', 1),
    (2, 'Carte 2', '#0f0', 1),
    (3, 'Carte 3', '#0f0', 2);

INSERT INTO
    "tag" ("id", "name", "color")
VALUES
    (1, 'Urgent', '#ff0000'),
    (2, 'Help', '#00ff00');

INSERT INTO
    "card_has_tag" ("card_id", "tag_id")
VALUES
    (1, 1),
    (3, 1);


SELECT setval('list_id_seq', (SELECT MAX(id) FROM "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) FROM "card"));
SELECT setval('tag_id_seq', (SELECT MAX(id) FROM "tag"));

COMMIT;
