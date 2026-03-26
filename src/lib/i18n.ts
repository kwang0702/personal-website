export type Locale = "en" | "zh";

const dict = {
  // ── Navigation ──
  "nav.photography": { en: "Photography", zh: "摄影" },
  "nav.videos": { en: "Videos", zh: "视频" },
  "nav.reviews": { en: "Reviews", zh: "影评" },
  "nav.music": { en: "Music", zh: "音乐" },
  "nav.fits": { en: "Fits", zh: "穿搭" },
  "nav.projects": { en: "Projects", zh: "项目" },
  "nav.culinary": { en: "Culinary", zh: "美食" },
  "nav.arts": { en: "Arts", zh: "艺术" },

  // ── Home page ──
  "home.label": { en: "Personal Archive", zh: "个人档案" },
  "home.heading1": { en: "A quiet place for", zh: "一个安静的地方" },
  "home.heading2": { en: "things I care about.", zh: "收藏我在意的一切。" },
  "home.description": {
    en: "Photography, film, music, style, cooking, art, and code — collected in one place. Not for sale, just for keeping.",
    zh: "摄影、电影、音乐、穿搭、烹饪、艺术与代码——收集在一处。不为出售，只为珍藏。",
  },
  "home.explore": { en: "Explore", zh: "探索" },
  "home.footer.name": { en: "K. Wang", zh: "K. Wang" },
  "home.footer.tagline": { en: "A personal collection.", zh: "一份个人收藏。" },

  // Home section descriptions
  "home.section.photography": {
    en: "Moments captured through the lens — street, portrait, and landscape.",
    zh: "镜头下的瞬间——街拍、人像与风景。",
  },
  "home.section.videos": {
    en: "Moving images — short films, edits, and visual experiments.",
    zh: "动态影像——短片、剪辑与视觉实验。",
  },
  "home.section.reviews": {
    en: "Thoughts on cinema — what I watched, what stayed with me.",
    zh: "关于电影的思考——看过的，留下的。",
  },
  "home.section.music": {
    en: "What I listen to — playlists, albums, and sonic textures.",
    zh: "我在听的——歌单、专辑与声音质感。",
  },
  "home.section.fits": {
    en: "Personal style documented — outfits and wardrobe notes.",
    zh: "个人风格记录——穿搭与衣橱笔记。",
  },
  "home.section.projects": {
    en: "Things I've built — code, tools, and technical explorations.",
    zh: "我做过的东西——代码、工具与技术探索。",
  },
  "home.section.culinary": {
    en: "Dishes I make — recipes, plating, and kitchen experiments.",
    zh: "我做的菜——食谱、摆盘与厨房实验。",
  },
  "home.section.arts": {
    en: "Paintings, sketches, and visual work by hand.",
    zh: "绘画、素描与手工视觉创作。",
  },

  // ── Photography page ──
  "photography.label": { en: "Photography", zh: "摄影" },
  "photography.heading": { en: "Through the lens.", zh: "透过镜头。" },
  "photography.description": {
    en: "Street, portrait, and landscape — moments I wanted to keep.",
    zh: "街拍、人像与风景——想要留住的瞬间。",
  },
  "photography.add_button": { en: "Add Photos", zh: "添加照片" },
  "photography.upload_title": { en: "Upload Photos", zh: "上传照片" },
  "photography.collection": { en: "Collection", zh: "集合" },
  "photography.new_collection": { en: "New collection", zh: "新建集合" },
  "photography.collection_placeholder": {
    en: "e.g. tokyo, street, portrait",
    zh: "如：东京、街拍、人像",
  },
  "photography.select_files": { en: "Select photos", zh: "选择照片" },
  "photography.uploading": { en: "Uploading…", zh: "上传中…" },
  "photography.upload": { en: "Upload", zh: "上传" },
  "photography.alt_placeholder": {
    en: "Describe this photo…",
    zh: "描述这张照片…",
  },
  "photography.files_selected": { en: "$1 photos selected", zh: "已选择 $1 张照片" },
  "photography.confirm_remove": {
    en: "Remove this photo from the collection?",
    zh: "确定从集合中移除这张照片吗？",
  },

  // ── Reviews page ──
  "reviews.label": { en: "Movie Reviews", zh: "电影评论" },
  "reviews.heading": { en: "What I watched.", zh: "我看过的。" },
  "reviews.description": {
    en: "Films that stayed with me — the ones worth remembering.",
    zh: "留在心里的电影——值得铭记的那些。",
  },

  // ── Music page ──
  "music.label": { en: "Music", zh: "音乐" },
  "music.heading": { en: "What I listen to.", zh: "我在听的。" },
  "music.description": {
    en: "Albums that defined a moment, a mood, or just stayed on repeat.",
    zh: "定义了某个时刻、某种心情的专辑，或只是一直在循环的。",
  },

  // ── Common / shared ──
  "common.loading": { en: "Loading...", zh: "加载中..." },
  "common.no_items": { en: "No items yet.", zh: "暂无内容。" },
  "common.no_photos": { en: "No photos yet.", zh: "暂无照片。" },
  "common.no_albums": { en: "No albums yet.", zh: "暂无专辑。" },
  "common.no_movies": { en: "No movies yet.", zh: "暂无电影。" },
  "common.close": { en: "Close", zh: "关闭" },
  "common.search": { en: "Search", zh: "搜索" },
  "common.searching": { en: "Searching...", zh: "搜索中..." },
  "common.add": { en: "Add", zh: "添加" },
  "common.adding": { en: "Adding...", zh: "添加中..." },
  "common.remove": { en: "Remove", zh: "移除" },
  "common.removing": { en: "Removing...", zh: "移除中..." },
  "common.edit": { en: "Edit", zh: "编辑" },
  "common.save": { en: "Save", zh: "保存" },
  "common.saving": { en: "Saving...", zh: "保存中..." },
  "common.cancel": { en: "Cancel", zh: "取消" },

  // ── Album / music components ──
  "music.add_button": { en: "Add Album / Song", zh: "添加专辑 / 歌曲" },
  "music.search_title": { en: "Search Albums & Songs", zh: "搜索专辑和歌曲" },
  "music.search_placeholder": {
    en: "Search by album name or artist...",
    zh: "按专辑名或歌手搜索...",
  },
  "music.type_song": { en: "Song", zh: "单曲" },
  "music.type_album": { en: "Album", zh: "专辑" },
  "music.single": { en: "Single", zh: "单曲" },
  "music.no_results": {
    en: "No results. Try a different search.",
    zh: "没有结果，请尝试其他关键词。",
  },
  "music.confirm_remove": {
    en: 'Remove "$1" from your collection?',
    zh: "确定从收藏中移除「$1」吗？",
  },

  // ── Movie components ──
  "movie.add_button": { en: "Add Movie", zh: "添加电影" },
  "movie.search_title": { en: "Search Movies", zh: "搜索电影" },
  "movie.search_placeholder": {
    en: "Search by English or Chinese title...",
    zh: "按中英文片名搜索...",
  },
  "movie.no_results": {
    en: "No results. Try a different title.",
    zh: "没有结果，请尝试其他片名。",
  },
  "movie.no_review": { en: "No review yet.", zh: "暂无评论。" },
  "movie.review_placeholder": {
    en: "Write your thoughts on this film...",
    zh: "写下你对这部电影的感想...",
  },
  "movie.confirm_remove": {
    en: 'Remove "$1" from your collection?',
    zh: "确定从收藏中移除「$1」吗？",
  },

  // ── Player ──
  "player.minimize": { en: "Minimize — keep playing", zh: "最小化——继续播放" },
  "player.close_stop": { en: "Close — stop music", zh: "关闭——停止播放" },
  "player.expand": { en: "Expand", zh: "展开" },
  "player.close": { en: "Close", zh: "关闭" },

  // ── Admin ──
  "admin.badge": { en: "admin", zh: "管理" },
  "admin.login_title": { en: "Admin Login", zh: "管理员登录" },
  "admin.password_placeholder": { en: "Password", zh: "密码" },
  "admin.wrong_password": { en: "Incorrect password.", zh: "密码错误。" },
  "admin.login_button": { en: "Login", zh: "登录" },

  // ── Accessibility ──
  "a11y.toggle_menu": { en: "Toggle menu", zh: "切换菜单" },
  "a11y.close": { en: "Close", zh: "关闭" },
  "a11y.prev_photo": { en: "Previous photo", zh: "上一张" },
  "a11y.next_photo": { en: "Next photo", zh: "下一张" },
  "a11y.minimize_player": { en: "Minimize player", zh: "最小化播放器" },
  "a11y.close_stop": { en: "Close and stop", zh: "关闭并停止" },
  "a11y.expand_player": { en: "Expand player", zh: "展开播放器" },
  "a11y.stop_music": { en: "Stop music", zh: "停止播放" },
} as const;

export type TranslationKey = keyof typeof dict;

export function t(key: TranslationKey, locale: Locale, ...args: string[]): string {
  const entry = dict[key];
  let text: string = entry[locale] ?? entry.en;
  // Replace $1, $2, etc. with positional args
  args.forEach((arg, i) => {
    text = text.replace(`$${i + 1}`, arg);
  });
  return text;
}
