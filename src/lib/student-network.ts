export interface StudentIdentity {
  email: string;
  name: string;
}

export interface PeerProfile {
  email: string;
  name: string;
  inviteCode: string;
  openToConnect: boolean;
  headline: string;
  updatedAt: string;
  sample?: boolean;
}

export interface StudentFriend {
  email: string;
  name: string;
  connectedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  ownerEmail: string;
  members: StudentIdentity[];
  createdAt: string;
}

export interface StudentNetwork {
  profile: PeerProfile;
  board: PeerProfile[];
  friends: StudentFriend[];
  groups: StudyGroup[];
  mode: 'remote' | 'local';
}

interface LocalStore {
  profiles: PeerProfile[];
  links: { a: string; b: string; aName: string; bName: string; connectedAt: string }[];
  groups: StudyGroup[];
}

const STORAGE_KEY = 'greyedStudentNetwork';
export const STUDENT_NETWORK_UPDATED_EVENT = 'greyed-student-network-updated';

const PROFILES_TABLE = 'student_peer_profiles';
const LINKS_TABLE = 'student_peer_links';
const GROUPS_TABLE = 'student_study_groups';

const normalizeEmail = (email?: string) => (email || '').trim().toLowerCase();
const normalizeCode = (code?: string) => (code || '').trim().toUpperCase();

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const getStudentInviteCode = (email: string) => {
  let hash = 2166136261;
  for (const char of normalizeEmail(email)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  let code = '';
  for (let index = 0; index < 6; index += 1) {
    code += CODE_ALPHABET[hash % CODE_ALPHABET.length];
    hash = Math.floor(hash / CODE_ALPHABET.length) || Math.imul(hash + index + 1, 2654435761) >>> 0;
  }

  return `GE-${code}`;
};

const sampleProfiles: PeerProfile[] = [
  {
    email: 'sample.amara@greyed.demo',
    name: 'Amara N.',
    inviteCode: getStudentInviteCode('sample.amara@greyed.demo'),
    openToConnect: true,
    headline: 'Grade 11, looking for a Physical Sciences revision partner',
    updatedAt: new Date().toISOString(),
    sample: true,
  },
  {
    email: 'sample.tumelo@greyed.demo',
    name: 'Tumelo K.',
    inviteCode: getStudentInviteCode('sample.tumelo@greyed.demo'),
    openToConnect: true,
    headline: 'Starting a Maths study group for exam prep',
    updatedAt: new Date().toISOString(),
    sample: true,
  },
];

const isMissingTableError = (error: unknown) => {
  const err = error as { code?: string; message?: string };
  const message = err?.message || '';
  return err?.code === '42P01'
    || err?.code === '42883'
    || err?.code === 'PGRST202'
    || err?.code === 'PGRST205'
    || /does not exist/i.test(message)
    || /schema cache/i.test(message)
    || /could not find the (table|function)/i.test(message);
};

const readLocal = (): LocalStore => {
  const empty: LocalStore = { profiles: [...sampleProfiles], links: [], groups: [] };
  if (typeof window === 'undefined') return empty;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    return {
      profiles: parsed.profiles || empty.profiles,
      links: parsed.links || [],
      groups: parsed.groups || [],
    };
  } catch {
    return empty;
  }
};

const writeLocal = (store: LocalStore) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage can be blocked (private mode); the in-memory event still refreshes the UI.
  }
  window.dispatchEvent(new CustomEvent(STUDENT_NETWORK_UPDATED_EVENT));
};

const notify = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STUDENT_NETWORK_UPDATED_EVENT));
  }
};

const defaultProfile = (me: StudentIdentity): PeerProfile => ({
  email: normalizeEmail(me.email),
  name: me.name,
  inviteCode: getStudentInviteCode(me.email),
  openToConnect: false,
  headline: '',
  updatedAt: new Date().toISOString(),
});

const pairKey = (first: string, second: string) => {
  const [a, b] = [normalizeEmail(first), normalizeEmail(second)].sort();
  return { a, b };
};

const getSupabase = async () => (await import('./supabase')).supabase;

type ProfileRow = {
  email: string;
  name: string;
  invite_code: string;
  open_to_connect: boolean;
  headline: string | null;
  updated_at: string;
};

type LinkRow = {
  student_a: string;
  student_b: string;
  student_a_name: string;
  student_b_name: string;
  created_at: string;
};

type GroupRow = {
  id: string;
  name: string;
  subject: string | null;
  owner_email: string;
  members: StudentIdentity[];
  created_at: string;
};

const fromProfileRow = (row: ProfileRow): PeerProfile => ({
  email: row.email,
  name: row.name,
  inviteCode: row.invite_code,
  openToConnect: row.open_to_connect,
  headline: row.headline || '',
  updatedAt: row.updated_at,
});

const fromGroupRow = (row: GroupRow): StudyGroup => ({
  id: row.id,
  name: row.name,
  subject: row.subject || '',
  ownerEmail: row.owner_email,
  members: row.members || [],
  createdAt: row.created_at,
});

const linksToFriends = (
  me: string,
  links: { a: string; b: string; aName: string; bName: string; connectedAt: string }[]
): StudentFriend[] => links
  .filter(link => link.a === me || link.b === me)
  .map(link => (link.a === me
    ? { email: link.b, name: link.bName, connectedAt: link.connectedAt }
    : { email: link.a, name: link.aName, connectedAt: link.connectedAt }))
  .sort((first, second) => first.name.localeCompare(second.name));

const buildBoard = (me: string, profiles: PeerProfile[], friends: StudentFriend[]) => {
  const friendEmails = new Set(friends.map(friend => friend.email));
  return profiles
    .filter(profile => profile.openToConnect && profile.email !== me && !friendEmails.has(profile.email))
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
};

const loadLocalNetwork = (me: StudentIdentity): StudentNetwork => {
  const email = normalizeEmail(me.email);
  const store = readLocal();
  let profile = store.profiles.find(item => item.email === email);

  if (!profile) {
    profile = defaultProfile(me);
    store.profiles.push(profile);
    writeLocal(store);
  }

  const friends = linksToFriends(email, store.links);
  return {
    profile,
    board: buildBoard(email, store.profiles, friends),
    friends,
    groups: store.groups.filter(group => group.members.some(member => normalizeEmail(member.email) === email)),
    mode: 'local',
  };
};

export const loadStudentNetwork = async (me: StudentIdentity): Promise<StudentNetwork> => {
  const email = normalizeEmail(me.email);
  if (!email) return loadLocalNetwork(me);

  try {
    const supabase = await getSupabase();

    const { data: ownRow, error: ownError } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (ownError) throw ownError;

    let profile = ownRow ? fromProfileRow(ownRow as ProfileRow) : null;
    if (!profile) {
      const fresh = defaultProfile(me);
      const { error: insertError } = await supabase.from(PROFILES_TABLE).insert({
        email: fresh.email,
        name: fresh.name,
        invite_code: fresh.inviteCode,
        open_to_connect: false,
        headline: '',
      });
      if (insertError) throw insertError;
      profile = fresh;
    }

    const [boardResult, linksResult, groupsResult] = await Promise.all([
      supabase.from(PROFILES_TABLE).select('*').eq('open_to_connect', true).neq('email', email).limit(50),
      supabase.from(LINKS_TABLE).select('*').or(`student_a.eq.${email},student_b.eq.${email}`),
      supabase.from(GROUPS_TABLE).select('*').contains('member_emails', [email]).order('created_at', { ascending: false }),
    ]);

    if (boardResult.error) throw boardResult.error;
    if (linksResult.error) throw linksResult.error;
    if (groupsResult.error) throw groupsResult.error;

    const friends = linksToFriends(email, (linksResult.data as LinkRow[]).map(row => ({
      a: row.student_a,
      b: row.student_b,
      aName: row.student_a_name,
      bName: row.student_b_name,
      connectedAt: row.created_at,
    })));

    return {
      profile,
      board: buildBoard(email, (boardResult.data as ProfileRow[]).map(fromProfileRow), friends),
      friends,
      groups: (groupsResult.data as GroupRow[]).map(fromGroupRow),
      mode: 'remote',
    };
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.warn('Student network unavailable, using this device only:', error);
    }
    return loadLocalNetwork(me);
  }
};

export const updateOpenToConnect = async (
  me: StudentIdentity,
  network: StudentNetwork,
  openToConnect: boolean,
  headline: string
) => {
  const email = normalizeEmail(me.email);
  const cleanHeadline = headline.trim().slice(0, 140);

  if (network.mode === 'remote') {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from(PROFILES_TABLE)
      .update({ open_to_connect: openToConnect, headline: cleanHeadline, name: me.name })
      .eq('email', email);
    if (error) throw error;
    notify();
    return;
  }

  const store = readLocal();
  store.profiles = store.profiles.map(profile => (profile.email === email
    ? { ...profile, name: me.name, openToConnect, headline: cleanHeadline, updatedAt: new Date().toISOString() }
    : profile));
  writeLocal(store);
};

export const connectWithInviteCode = async (
  me: StudentIdentity,
  network: StudentNetwork,
  rawCode: string
): Promise<StudentFriend> => {
  const email = normalizeEmail(me.email);
  const code = normalizeCode(rawCode);

  if (!code) throw new Error('Enter a student invite code.');
  if (code === network.profile.inviteCode) throw new Error('That is your own invite code. Share it with a classmate instead.');

  if (network.mode === 'remote') {
    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc('find_student_by_invite_code', { p_code: code });
    if (error) throw error;

    const match = (data as { email: string; name: string }[] | null)?.[0];
    if (!match) throw new Error('No student found with that invite code.');

    if (network.friends.some(friend => friend.email === match.email)) {
      throw new Error(`You are already connected with ${match.name}.`);
    }

    const { a, b } = pairKey(email, match.email);
    const { error: linkError } = await supabase.from(LINKS_TABLE).upsert({
      student_a: a,
      student_b: b,
      student_a_name: a === email ? me.name : match.name,
      student_b_name: b === email ? me.name : match.name,
      requested_by: email,
    }, { onConflict: 'student_a,student_b' });
    if (linkError) throw linkError;

    notify();
    return { email: match.email, name: match.name, connectedAt: new Date().toISOString() };
  }

  const store = readLocal();
  const match = store.profiles.find(profile => profile.inviteCode === code);
  if (!match) throw new Error('No student found with that invite code.');

  const { a, b } = pairKey(email, match.email);
  if (store.links.some(link => link.a === a && link.b === b)) {
    throw new Error(`You are already connected with ${match.name}.`);
  }

  const connectedAt = new Date().toISOString();
  store.links.push({
    a,
    b,
    aName: a === email ? me.name : match.name,
    bName: b === email ? me.name : match.name,
    connectedAt,
  });
  writeLocal(store);
  return { email: match.email, name: match.name, connectedAt };
};

export const createStudyGroup = async (
  me: StudentIdentity,
  network: StudentNetwork,
  input: { name: string; subject: string; memberEmails: string[] }
) => {
  const email = normalizeEmail(me.email);
  const name = input.name.trim();
  if (!name) throw new Error('Give your study group a name.');
  if (input.memberEmails.length === 0) throw new Error('Pick at least one friend to invite.');

  const members: StudentIdentity[] = [
    { email, name: me.name },
    ...network.friends
      .filter(friend => input.memberEmails.includes(friend.email))
      .map(friend => ({ email: friend.email, name: friend.name })),
  ];

  if (network.mode === 'remote') {
    const supabase = await getSupabase();
    const { error } = await supabase.from(GROUPS_TABLE).insert({
      name,
      subject: input.subject.trim(),
      owner_email: email,
      members,
      member_emails: members.map(member => normalizeEmail(member.email)),
    });
    if (error) throw error;
    notify();
    return;
  }

  const store = readLocal();
  store.groups.unshift({
    id: `group-${Date.now()}`,
    name,
    subject: input.subject.trim(),
    ownerEmail: email,
    members,
    createdAt: new Date().toISOString(),
  });
  writeLocal(store);
};

export const leaveStudyGroup = async (me: StudentIdentity, network: StudentNetwork, groupId: string) => {
  const email = normalizeEmail(me.email);
  const group = network.groups.find(item => item.id === groupId);
  if (!group) return;

  const remaining = group.members.filter(member => normalizeEmail(member.email) !== email);

  if (network.mode === 'remote') {
    const supabase = await getSupabase();
    const { error } = group.ownerEmail === email
      ? await supabase.from(GROUPS_TABLE).delete().eq('id', groupId)
      : await supabase.rpc('leave_study_group', { p_group_id: groupId });
    if (error) throw error;
    notify();
    return;
  }

  const store = readLocal();
  store.groups = group.ownerEmail === email || remaining.length === 0
    ? store.groups.filter(item => item.id !== groupId)
    : store.groups.map(item => (item.id === groupId ? { ...item, members: remaining } : item));
  writeLocal(store);
};
