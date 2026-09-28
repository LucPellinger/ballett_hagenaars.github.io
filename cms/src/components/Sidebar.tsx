import { collections, type CollectionId } from '@/content/collections';
import type { Status } from '../api';

export interface SidebarProps {
  active: CollectionId;
  onSelect: (id: CollectionId) => void;
  unsaved: Set<CollectionId>;
  unpublished: Set<CollectionId>;
  placeholders: Record<string, number>;
  status: Status | null;
  onSync: () => void;
}

const GROUPS = ['Allgemein', 'Unterricht', 'Schule', 'Rechtliches'] as const;

export function Sidebar({ active, onSelect, unsaved, unpublished, placeholders, status, onSync }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Bereiche">
      {GROUPS.map((g) => (
        <div key={g} className="sidebar-group">
          <h2 className="sidebar-title">{g}</h2>
          <ul>
            {collections
              .filter((c) => c.group === g)
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`sidebar-item ${active === c.id ? 'is-active' : ''}`}
                    aria-current={active === c.id ? 'page' : undefined}
                    onClick={() => onSelect(c.id)}
                  >
                    <span>{c.label}</span>
                    <span className="sidebar-badges">
                      {unsaved.has(c.id) && <span className="dot dot--unsaved" title="Nicht gespeichert" />}
                      {!unsaved.has(c.id) && unpublished.has(c.id) && <span className="dot dot--unpublished" title="Gespeichert, noch nicht veröffentlicht" />}
                      {(placeholders[c.id] ?? 0) > 0 && (
                        <span className="count" title="Beispielinhalte">
                          {placeholders[c.id]}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="sidebar-legend">
        <p>
          <span className="dot dot--unsaved" /> nicht gespeichert
        </p>
        <p>
          <span className="dot dot--unpublished" /> noch nicht veröffentlicht
        </p>
        <p>
          <span className="count">2</span> Beispielinhalte
        </p>
      </div>
      {status?.onContentBranch && (
        <button type="button" className="btn btn--ghost btn--small sidebar-sync" onClick={onSync}>
          ⟳ Neueste Version holen
        </button>
      )}
    </nav>
  );
}
