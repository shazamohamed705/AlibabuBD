import { useState, useEffect } from 'react';
import JournalHero     from '../components/journal/JournalHero';
import JournalFeatured from '../components/journal/JournalFeatured';
import JournalGrid     from '../components/journal/JournalGrid';
import { apiFetch }    from '../lib/apiFetch';
import { useI18n }     from '../i18n/i18nContext';

// Map API journal item → shape JournalFeatured/Grid expect
function mapJournal(j, lang) {
  // API may return localised fields (titleEn/titleAr) or already-resolved (title/description)
  const title = j.title
    || (lang === 'ar' ? (j.titleAr || j.titleEn) : (j.titleEn || j.titleAr))
    || '';
  const description = j.description
    || (lang === 'ar' ? (j.descriptionAr || j.descriptionEn) : (j.descriptionEn || j.descriptionAr))
    || '';

  const rawImg = j.imageUrl || j.image || '';
  const img = rawImg.includes('localhost')
    ? rawImg.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com')
    : rawImg.startsWith('http')
      ? rawImg
      : `https://aurevia-brand.com${rawImg}`;

  return {
    _id:     j._id || j.id,
    id:      j._id || j.id,
    title,
    excerpt: description,
    date:    new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    read:    '5 min read',
    img,
    featured: j.order === 0,
  };
}

export default function Journal() {
  const { lang }       = useI18n();
  const [posts,    setPosts]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch('/journal?page=1&limit=20', { lang })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        const list = (json?.data?.journals ?? [])
          .filter(j => j.isActive !== false)
          .sort((a, b) => a.order - b.order)
          .map(j => mapJournal(j, lang));
        setPosts(list);
        setSelected(list[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <main className="bg-white">
      <JournalHero />
      {!loading && selected && (
        <JournalFeatured post={selected} />
      )}
      {!loading && posts.length > 0 && (
        <JournalGrid
          posts={posts}
          activeId={selected?._id}
          onSelect={setSelected}
        />
      )}
    </main>
  );
}
