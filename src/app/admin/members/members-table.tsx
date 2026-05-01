'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'TENANT' | 'ADVOCATE' | 'MODERATOR' | 'ADMIN';
  parkCommunity: string | null;
  verified: boolean;
  banned: boolean;
  bannedReason: string | null;
  createdAt: Date;
};

type Counts = {
  all: number;
  unverified: number;
  banned: number;
  admins: number;
  advocates: number;
};

const ROLE_LABELS: Record<User['role'], string> = {
  TENANT: 'Tenant',
  ADVOCATE: 'Advocate',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
};

const ROLE_COLORS: Record<User['role'], string> = {
  TENANT: 'bg-sage-100 text-sage-900',
  ADVOCATE: 'bg-coral-100 text-coral-600',
  MODERATOR: 'bg-gold-200 text-sage-900',
  ADMIN: 'bg-sage-900 text-cream-50',
};

export function MembersTable({ users: initialUsers, counts, currentQuery, currentFilter }: {
  users: User[];
  counts: Counts;
  currentQuery: string;
  currentFilter: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState(currentQuery);
  const [busyId, setBusyId] = useState<string | null>(null);

  function applyFilter(filter: string) {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (filter !== 'all') params.set('filter', filter);
    router.push(`/admin/members?${params.toString()}`);
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (currentFilter !== 'all') params.set('filter', currentFilter);
    router.push(`/admin/members?${params.toString()}`);
  }

  async function patchUser(id: string, body: any) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data.user } : u));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function changeRole(id: string, role: User['role']) {
    if (!confirm(`Change role to ${ROLE_LABELS[role]}?`)) return;
    await patchUser(id, { role });
  }

  async function approve(id: string) {
    await patchUser(id, { verified: true });
  }

  async function unverify(id: string) {
    await patchUser(id, { verified: false });
  }

  async function ban(id: string) {
    const reason = prompt('Reason for ban (optional, but recommended):');
    if (reason === null) return;
    await patchUser(id, { banned: true, bannedReason: reason || null });
  }

  async function unban(id: string) {
    if (!confirm('Restore this account?')) return;
    await patchUser(id, { banned: false, bannedReason: null });
  }

  async function deleteUser(id: string, name: string | null) {
    if (!confirm(`PERMANENTLY DELETE ${name ?? 'this user'}? This cannot be undone, and will remove all their threads, replies, and posts.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const filterTabs: Array<{ key: string; label: string; count: number }> = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'unverified', label: 'Pending approval', count: counts.unverified },
    { key: 'admins', label: 'Admins & Mods', count: counts.admins },
    { key: 'advocates', label: 'Advocates', count: counts.advocates },
    { key: 'banned', label: 'Banned', count: counts.banned },
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => applyFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === tab.key
                ? 'bg-sage-900 text-cream-50'
                : 'bg-cream-100 text-sage-900 hover:bg-sage-100'
            }`}
          >
            {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={applySearch} className="mb-6 flex gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or community…"
          className="flex-1 px-4 py-2 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 text-sm"
        />
        <button type="submit" className="btn-primary px-5 py-2 text-sm font-medium">Search</button>
      </form>

      {/* Table */}
      {users.length === 0 ? (
        <div className="bg-cream-100 border border-sage-900/10 rounded-md p-8 text-center text-ink/60">
          No members match.
        </div>
      ) : (
        <div className="bg-white border border-sage-900/10 rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Community</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={`border-t border-sage-900/10 ${u.banned ? 'bg-coral-100/40' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sage-900">{u.name ?? '(no name)'}</div>
                    <div className="text-xs text-ink/60">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/75">{u.parkCommunity ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.banned ? (
                      <span className="text-coral-600 text-xs font-medium" title={u.bannedReason ?? ''}>
                        ⛔ Banned
                      </span>
                    ) : u.verified ? (
                      <span className="text-sage-700 text-xs font-medium">✓ Approved</span>
                    ) : (
                      <span className="text-gold-500 text-xs font-medium">⏳ Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/60 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <UserActions
                      user={u}
                      busy={busyId === u.id}
                      onApprove={() => approve(u.id)}
                      onUnverify={() => unverify(u.id)}
                      onBan={() => ban(u.id)}
                      onUnban={() => unban(u.id)}
                      onChangeRole={(role) => changeRole(u.id, role)}
                      onDelete={() => deleteUser(u.id, u.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function UserActions({ user, busy, onApprove, onUnverify, onBan, onUnban, onChangeRole, onDelete }: {
  user: User;
  busy: boolean;
  onApprove: () => void;
  onUnverify: () => void;
  onBan: () => void;
  onUnban: () => void;
  onChangeRole: (role: User['role']) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        disabled={busy}
        className="px-3 py-1.5 rounded-md text-xs font-medium bg-sage-100 hover:bg-sage-200 text-sage-900 disabled:opacity-50"
      >
        {busy ? '...' : 'Manage ▾'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-56 bg-white border border-sage-900/15 rounded-md shadow-lg z-20 py-1">
            {!user.verified && (
              <ActionItem onClick={() => { setOpen(false); onApprove(); }}>✓ Approve member</ActionItem>
            )}
            {user.verified && !user.banned && (
              <ActionItem onClick={() => { setOpen(false); onUnverify(); }}>Revoke approval</ActionItem>
            )}

            <Separator label="Set role" />
            {(['TENANT', 'ADVOCATE', 'MODERATOR', 'ADMIN'] as const).map(r => (
              <ActionItem
                key={r}
                onClick={() => { setOpen(false); onChangeRole(r); }}
                disabled={user.role === r}
              >
                {user.role === r ? '• ' : '  '}{ROLE_LABELS[r]}
              </ActionItem>
            ))}

            <Separator />
            {user.banned ? (
              <ActionItem onClick={() => { setOpen(false); onUnban(); }} className="text-sage-700">
                Restore account
              </ActionItem>
            ) : (
              <ActionItem onClick={() => { setOpen(false); onBan(); }} className="text-coral-600">
                ⛔ Ban member
              </ActionItem>
            )}
            <ActionItem onClick={() => { setOpen(false); onDelete(); }} className="text-coral-600">
              Delete permanently
            </ActionItem>
          </div>
        </>
      )}
    </div>
  );
}

function ActionItem({ children, onClick, disabled, className = '' }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`block w-full text-left px-4 py-2 text-sm hover:bg-cream-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

function Separator({ label }: { label?: string }) {
  return (
    <div className="border-t border-sage-900/10 my-1">
      {label && <div className="px-4 pt-2 text-[10px] uppercase tracking-[0.18em] text-ink/50 font-medium">{label}</div>}
    </div>
  );
}
