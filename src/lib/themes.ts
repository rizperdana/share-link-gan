// ============================================
// ShareLinkGan — Theme Configuration
// 54 themes: 4 original + 50 new
// ============================================

export interface ThemeConfig {
  value: string;
  label: string;
  category: string;
  font: string;
  // Preview card colors
  bg: string;
  bar1: string;
  bar2: string;
  bar3: string;
}

export const THEME_CATEGORIES = [
  "Classic",
  "Dark Vibes",
  "Colorful",
  "Pastel",
  "Nature",
  "Gradient",
  "Retro",
  "Minimal",
  "Animated",
  "Premium",
] as const;

export const FONT_MAP: Record<string, string> = {
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif",
  outfit: "'Outfit', sans-serif",
  playfair: "'Playfair Display', serif",
  spacemono: "'Space Mono', monospace",
  comfortaa: "'Comfortaa', cursive",
  quicksand: "'Quicksand', sans-serif",
  raleway: "'Raleway', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  lexend: "'Lexend', sans-serif",
  jetbrains: "'JetBrains Mono', monospace",
  caveat: "'Caveat', cursive",
  nunito: "'Nunito', sans-serif",
  josefin: "'Josefin Sans', sans-serif",
};

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Mono:wght@400;700&family=Comfortaa:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Josefin+Sans:wght@400;500;600;700&display=swap";

export const THEMES: ThemeConfig[] = [
  // ============ Classic (original 4) ============
  { value: "dark", label: "Dark", category: "Classic", font: "inter", bg: "#1a1a2e", bar1: "#e94560", bar2: "#0f3460", bar3: "#533483" },
  { value: "light", label: "Light", category: "Classic", font: "inter", bg: "#f8f9fa", bar1: "#2d8840", bar2: "#6c63ff", bar3: "#e0e0e0" },
  { value: "neon", label: "Neon", category: "Classic", font: "inter", bg: "#0a0a14", bar1: "#00ff41", bar2: "#ff00ff", bar3: "#00d4ff" },
  { value: "glass", label: "Glass", category: "Classic", font: "inter", bg: "linear-gradient(135deg, #667eea, #764ba2)", bar1: "rgba(255,255,255,0.3)", bar2: "rgba(255,255,255,0.2)", bar3: "rgba(255,255,255,0.15)" },

  // ============ Dark Vibes ============
  { value: "midnight", label: "Midnight", category: "Dark Vibes", font: "outfit", bg: "#0d0d1a", bar1: "#6366f1", bar2: "#312e81", bar3: "#1e1b4b" },
  { value: "dracula", label: "Dracula", category: "Dark Vibes", font: "jetbrains", bg: "#282a36", bar1: "#ff79c6", bar2: "#bd93f9", bar3: "#50fa7b" },
  { value: "monokai", label: "Monokai", category: "Dark Vibes", font: "spacemono", bg: "#272822", bar1: "#f92672", bar2: "#a6e22e", bar3: "#66d9ef" },
  { value: "cyberpunk", label: "Cyberpunk", category: "Dark Vibes", font: "rajdhani", bg: "#0a0015", bar1: "#ff2a6d", bar2: "#05d9e8", bar3: "#d1f7ff" },
  { value: "abyss", label: "Abyss", category: "Dark Vibes", font: "raleway", bg: "#000814", bar1: "#003566", bar2: "#001d3d", bar3: "#ffc300" },
  { value: "obsidian", label: "Obsidian", category: "Dark Vibes", font: "montserrat", bg: "#0b0b0b", bar1: "#e74c3c", bar2: "#2c3e50", bar3: "#ecf0f1" },

  // ============ Colorful ============
  { value: "sunset", label: "Sunset", category: "Colorful", font: "poppins", bg: "linear-gradient(135deg, #ee9ca7, #ffdde1)", bar1: "#e94560", bar2: "#f39189", bar3: "#ffd460" },
  { value: "ocean", label: "Ocean", category: "Colorful", font: "quicksand", bg: "linear-gradient(135deg, #2193b0, #6dd5ed)", bar1: "#0077b6", bar2: "#00b4d8", bar3: "#90e0ef" },
  { value: "aurora", label: "Aurora", category: "Colorful", font: "comfortaa", bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", bar1: "#43e97b", bar2: "#38f9d7", bar3: "#fa709a" },
  { value: "candy", label: "Candy", category: "Colorful", font: "nunito", bg: "linear-gradient(135deg, #f093fb, #f5576c)", bar1: "#ff6b6b", bar2: "#feca57", bar3: "#48dbfb" },
  { value: "tropical", label: "Tropical", category: "Colorful", font: "poppins", bg: "linear-gradient(135deg, #11998e, #38ef7d)", bar1: "#00b894", bar2: "#55efc4", bar3: "#ffeaa7" },
  { value: "lava", label: "Lava", category: "Colorful", font: "montserrat", bg: "linear-gradient(135deg, #f12711, #f5af19)", bar1: "#e74c3c", bar2: "#f39c12", bar3: "#e67e22" },

  // ============ Pastel ============
  { value: "sakura", label: "Sakura", category: "Pastel", font: "quicksand", bg: "#fff0f5", bar1: "#ffb6c1", bar2: "#ffc0cb", bar3: "#ffe4e1" },
  { value: "lavender", label: "Lavender", category: "Pastel", font: "comfortaa", bg: "#f3e8ff", bar1: "#c4b5fd", bar2: "#ddd6fe", bar3: "#e9d5ff" },
  { value: "mint", label: "Mint", category: "Pastel", font: "nunito", bg: "#ecfdf5", bar1: "#6ee7b7", bar2: "#a7f3d0", bar3: "#d1fae5" },
  { value: "peach", label: "Peach", category: "Pastel", font: "poppins", bg: "#fff7ed", bar1: "#fdba74", bar2: "#fed7aa", bar3: "#ffedd5" },
  { value: "sky", label: "Sky", category: "Pastel", font: "outfit", bg: "#f0f9ff", bar1: "#7dd3fc", bar2: "#bae6fd", bar3: "#e0f2fe" },
  { value: "cream", label: "Cream", category: "Pastel", font: "playfair", bg: "#fefce8", bar1: "#fde68a", bar2: "#fef08a", bar3: "#fef9c3" },

  // ============ Nature ============
  { value: "forest", label: "Forest", category: "Nature", font: "raleway", bg: "#0b3d0b", bar1: "#2d6a4f", bar2: "#40916c", bar3: "#52b788" },
  { value: "desert", label: "Desert", category: "Nature", font: "josefin", bg: "#3d2b1f", bar1: "#c68b59", bar2: "#d4a373", bar3: "#e9c88b" },
  { value: "arctic", label: "Arctic", category: "Nature", font: "quicksand", bg: "#e3f2fd", bar1: "#90caf9", bar2: "#bbdefb", bar3: "#42a5f5" },
  { value: "volcano", label: "Volcano", category: "Nature", font: "montserrat", bg: "#1a0000", bar1: "#ff4500", bar2: "#ff6347", bar3: "#b22222" },
  { value: "coral", label: "Coral Reef", category: "Nature", font: "comfortaa", bg: "#e0f7fa", bar1: "#00bcd4", bar2: "#ff7043", bar3: "#ffab91" },

  // ============ Gradient ============
  { value: "synthwave", label: "Synthwave", category: "Gradient", font: "outfit", bg: "linear-gradient(135deg, #200034, #4a0080, #200034)", bar1: "#ff6ec7", bar2: "#7873f5", bar3: "#3bf0e4" },
  { value: "northern", label: "Northern Lights", category: "Gradient", font: "raleway", bg: "linear-gradient(180deg, #020024, #090979, #00d4aa)", bar1: "#00ff87", bar2: "#60efff", bar3: "#0061ff" },
  { value: "bubblegum", label: "Bubblegum", category: "Gradient", font: "nunito", bg: "linear-gradient(135deg, #f6d5f7, #fbe9d7)", bar1: "#e879f9", bar2: "#fb923c", bar3: "#f472b6" },
  { value: "twilight", label: "Twilight", category: "Gradient", font: "playfair", bg: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", bar1: "#f97316", bar2: "#8b5cf6", bar3: "#06b6d4" },
  { value: "prism", label: "Prism", category: "Gradient", font: "poppins", bg: "linear-gradient(135deg, #654ea3, #eaafc8)", bar1: "#c084fc", bar2: "#fb7185", bar3: "#fbbf24" },
  { value: "nebula", label: "Nebula", category: "Gradient", font: "outfit", bg: "linear-gradient(135deg, #1a002e, #3d0066, #6600b3)", bar1: "#e040fb", bar2: "#7c4dff", bar3: "#536dfe" },

  // ============ Retro ============
  { value: "retro90", label: "90's Retro", category: "Retro", font: "spacemono", bg: "#1b1464", bar1: "#f8d210", bar2: "#e8505b", bar3: "#32e0c4" },
  { value: "vaporwave", label: "Vaporwave", category: "Retro", font: "comfortaa", bg: "#2b0040", bar1: "#ff71ce", bar2: "#01cdfe", bar3: "#05ffa1" },
  { value: "pixel", label: "Pixel", category: "Retro", font: "jetbrains", bg: "#212529", bar1: "#20c997", bar2: "#845ef7", bar3: "#fa5252" },
  { value: "vintage", label: "Vintage", category: "Retro", font: "playfair", bg: "#f5f0e1", bar1: "#8b4513", bar2: "#a0522d", bar3: "#deb887" },
  { value: "arcade", label: "Arcade", category: "Retro", font: "spacemono", bg: "#000000", bar1: "#ff0000", bar2: "#ffff00", bar3: "#00ff00" },

  // ============ Minimal ============
  { value: "paper", label: "Paper", category: "Minimal", font: "inter", bg: "#fafaf9", bar1: "#78716c", bar2: "#a8a29e", bar3: "#d6d3d1" },
  { value: "ink", label: "Ink", category: "Minimal", font: "playfair", bg: "#fefce8", bar1: "#1c1917", bar2: "#44403c", bar3: "#78716c" },
  { value: "snow", label: "Snow", category: "Minimal", font: "quicksand", bg: "#ffffff", bar1: "#e2e8f0", bar2: "#cbd5e1", bar3: "#94a3b8" },
  { value: "charcoal", label: "Charcoal", category: "Minimal", font: "raleway", bg: "#18181b", bar1: "#3f3f46", bar2: "#52525b", bar3: "#71717a" },
  { value: "blueprint", label: "Blueprint", category: "Minimal", font: "jetbrains", bg: "#0c1929", bar1: "#1e40af", bar2: "#3b82f6", bar3: "#60a5fa" },

  // ============ Animated (special) ============
  { value: "matrix", label: "Matrix", category: "Animated", font: "jetbrains", bg: "#000000", bar1: "#00ff41", bar2: "#008f11", bar3: "#003b00" },
  { value: "starfield", label: "Starfield", category: "Animated", font: "outfit", bg: "#000011", bar1: "#ffffff", bar2: "#aaaaff", bar3: "#6666cc" },
  { value: "firefly", label: "Firefly", category: "Animated", font: "comfortaa", bg: "#0a1628", bar1: "#fbbf24", bar2: "#f59e0b", bar3: "#d97706" },
  { value: "ripple", label: "Ripple", category: "Animated", font: "quicksand", bg: "#0c0a3e", bar1: "#7b2ff7", bar2: "#c93bfd", bar3: "#ed49c1" },
  { value: "aurora_wave", label: "Aurora Wave", category: "Animated", font: "raleway", bg: "#001220", bar1: "#00ff87", bar2: "#60efff", bar3: "#7b61ff" },

  // ============ Premium ============
  { value: "gold", label: "Gold", category: "Premium", font: "playfair", bg: "#1a1a1a", bar1: "#ffd700", bar2: "#daa520", bar3: "#b8860b" },
  { value: "rose_gold", label: "Rose Gold", category: "Premium", font: "quicksand", bg: "#1a0a0a", bar1: "#e8b4b8", bar2: "#b76e79", bar3: "#8e4455" },
  { value: "platinum", label: "Platinum", category: "Premium", font: "montserrat", bg: "#0a0a0e", bar1: "#e5e4e2", bar2: "#bfc1c2", bar3: "#848789" },
  { value: "emerald", label: "Emerald", category: "Premium", font: "raleway", bg: "#001a0e", bar1: "#50c878", bar2: "#2e8b57", bar3: "#1a6b3c" },
  { value: "sapphire", label: "Sapphire", category: "Premium", font: "outfit", bg: "#000a1a", bar1: "#0f52ba", bar2: "#1565c0", bar3: "#0d47a1" },
];

/** Get theme config by value */
export function getTheme(value: string): ThemeConfig {
  return THEMES.find((t) => t.value === value) || THEMES[0];
}

/** Get Google Fonts family string for a theme */
export function getThemeFont(value: string): string {
  const theme = getTheme(value);
  return FONT_MAP[theme.font] || FONT_MAP.inter;
}
