"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchBookmarks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    // 🔹 1. REALTIME (best effort)
    const channel = supabase
      .channel("bookmark-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks(),
      )
      .subscribe();

    // 🔹 2. POLLING FALLBACK (guaranteed)
    const interval = setInterval(() => {
      fetchBookmarks();
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="space-y-3">
      {bookmarks.length === 0 && (
        <p className="text-gray-500 text-center">No bookmarks yet</p>
      )}

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="border rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <a
              href={b.url}
              target="_blank"
              className="text-blue-600 font-semibold"
            >
              {b.title}
            </a>
            <div className="text-xs text-gray-500">{b.url}</div>
          </div>

          <button onClick={() => deleteBookmark(b.id)} className="text-red-500">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
