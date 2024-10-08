import { v4 as uuid } from "uuid";
import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
import groups from "$lib/groups.json";

export async function POST({ request, cookies }) {
    const formData = await request.json();

    if (!groups.includes(formData.group)) {
        return json({
            error: "Invalid group selected."
        });
    } else if (!formData.title || !formData.content) {
        return json({
            error: "You must fill out all fields."
        });
    } else if ( formData.title.length <= 5 || formData.title.length > 64) {
        return json({
            error: "Title must be between 5 char and 64 chars."
        });
    } else if (formData.content.length <= 5 || formData.content.length > 250) {
        return json({
            error: "Content must be between 5 char and 250 chars."
        });
    } else {
        try {
            const id = uuid();

            const author = await db`SELECT id FROM forum_users WHERE id = ${cookies.get("session")};`;
            await db`INSERT INTO forum_posts (id, title, content, date, author, "group") VALUES (${id}, ${formData.title}, ${formData.content}, ${new Date().toLocaleString()}, ${author[0].id}, ${formData.group});`;

            return json({
                success: true,
                id
            });
        } catch (e) {
            return json({
                error: "An error occured with creating this post."
            });
        }
    }
}