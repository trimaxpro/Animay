import type { Character } from '@/types/anime';

interface CharacterListProps {
  characters: Character[];
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {characters.slice(0, 20).map((char) => (
        <div key={char.mal_id} className="flex-shrink-0 w-[120px] text-center">
          <div className="w-[100px] h-[100px] mx-auto rounded-card overflow-hidden bg-elevated mb-2">
            <img
              src={char.images.jpg?.image_url}
              alt={char.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <p className="text-xs text-text-primary line-clamp-2 font-medium">{char.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{char.role}</p>
          {char.voice_actors?.[0] && (
            <p className="text-xs text-accent-glow mt-0.5 line-clamp-1">{char.voice_actors[0].person.name}</p>
          )}
        </div>
      ))}
    </div>
  );
}
