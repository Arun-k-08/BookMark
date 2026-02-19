"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="space-y-3">

      {bookmarks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No bookmarks yet — add your first one 🚀
        </div>
      )}

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
        >
          <div>
            <a
              href={b.url}
              target="_blank"
              className="font-semibold text-blue-600 hover:underline"
            >
              {b.title}
            </a>

            <div className="text-xs text-gray-500 break-all">
              {b.url}
            </div>
          </div>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg"
          >
            Delete
          </button>

        </div>
      ))}
    </div>
  );
}
