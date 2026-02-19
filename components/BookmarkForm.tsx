"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";



export default function BookmarkForm({ user }: any) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");



  const addBookmark = async () => {
    if (!url || !title) return;

    await supabase.from("bookmarks").insert({
      url,
      title,
      user_id: user.id,
    });

    setUrl("");
    setTitle("");

  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl shadow-sm mb-6">

      <h2 className="font-semibold mb-3 text-gray-900">Add Bookmark</h2>

      <div className="flex flex-col sm:flex-row gap-2">

        <input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />

        <button
          onClick={addBookmark}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg"
        >
          Add
        </button>

      </div>

    </div>
  );
}
