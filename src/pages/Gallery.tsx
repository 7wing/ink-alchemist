import AppShell from "@/components/AppShell";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Lock } from "lucide-react";

const posts = [
  { image: swatch1, user: "InkAlchemist", caption: "2018 Diamine LE — the sheen on this is unreal", paper: "Tomoe River 52gsm", reactions: 12 },
  { image: swatch2, user: "QuillMaster42", caption: "Nitrogen shimmer under warm lamp — gold particles dancing", paper: "Cosmo Air Light", reactions: 28 },
  { image: swatch1, user: "VelvetNib", caption: "Just acquired this discontinued Sailor bottle…", paper: "Midori MD", reactions: 45 },
  { image: swatch2, user: "ParchmentDreamer", caption: "Which paper for this ink? Suggestions welcome", paper: "Rhodia 80gsm", reactions: 8 },
];

const Gallery = () => (
  <AppShell>
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Community Scriptorium</h2>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-label mb-8">A curated gallery by invitation only</p>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <article
            key={post.user + i}
            className="rounded-lg overflow-hidden border border-border bg-card/50 backdrop-blur-sm"
            style={{ animation: `fade-up 0.8s ease-out ${i * 120}ms forwards`, opacity: 0 }}
          >
            <img src={post.image} alt={post.caption} className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <div className="p-4">
              <p className="font-label text-xs text-antique-gold mb-1">@{post.user}</p>
              <p className="font-body text-sm text-foreground">{post.caption}</p>
              <p className="text-[10px] text-muted-foreground font-label mt-1">on {post.paper}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="text-xs font-label px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-primary transition-colors" aria-label="React with exquisite sheen">
                  ✨ Exquisite sheen · {post.reactions}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </AppShell>
);

export default Gallery;
