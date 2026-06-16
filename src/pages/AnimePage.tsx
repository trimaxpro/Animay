import { useParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AnimeHero } from '@/components/anime/AnimeHero';
import { InfoPanel } from '@/components/anime/InfoPanel';
import { EpisodeGrid } from '@/components/anime/EpisodeGrid';
import { CharacterList } from '@/components/anime/CharacterList';
import { RelatedAnime } from '@/components/anime/RelatedAnime';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { useAnimeDetail, useAnimeEpisodes, useRecommendations } from '@/hooks/useAnime';
import { AlertCircle, List, Users, ThumbsUp } from 'lucide-react';

export default function AnimePage() {
  const { id } = useParams<{ id: string }>();
  const animeId = Number(id);

  const detail = useAnimeDetail(animeId);
  const episodes = useAnimeEpisodes(animeId);
  const recommendations = useRecommendations(animeId);

  if (detail.isError) {
    return (
      <PageWrapper className="pt-24 pb-12 px-4">
        <EmptyState
          icon={AlertCircle}
          title="Failed to load anime"
          message="Something went wrong loading this content."
          actionLabel="Try Again"
          onAction={() => detail.refetch()}
        />
      </PageWrapper>
    );
  }

  if (detail.isLoading) {
    return (
      <PageWrapper className="pt-24 pb-12">
        <HeroSkeleton />
      </PageWrapper>
    );
  }

  const anime = detail.data;
  if (!anime) return null;

  return (
    <PageWrapper>
      <AnimeHero anime={anime} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <InfoPanel anime={anime} />

        {episodes.data && episodes.data.length > 0 && (
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-4 flex items-center gap-2"><List className="w-5 h-5 text-accent-glow stroke-[1.5]" /> Episodes</h2>
            <EpisodeGrid animeId={animeId} episodes={episodes.data} isLoading={episodes.isLoading} />
          </section>
        )}

        {anime.characters && anime.characters.length > 0 && (
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-accent-glow stroke-[1.5]" /> Characters & Voice Actors</h2>
            <CharacterList characters={anime.characters} />
          </section>
        )}

        {recommendations.data && recommendations.data.length > 0 && (
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-4 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-accent-glow stroke-[1.5]" /> You Might Also Like</h2>
            <RelatedAnime anime={recommendations.data} />
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
