import fs from 'fs';
import path from 'path';

export interface Member {
  id: string;
  name: string;
  role: string;
  gender: string;
  age: string;
  joinDate: string;
  responsibilities: string;
  mbti: string;
  zodiac: string;
  avatar?: string;
}

export async function getMembers(): Promise<Member[]> {
  const membersDir = path.join(process.cwd(), 'src/content/members');

  if (!fs.existsSync(membersDir)) {
    return [];
  }

  const files = fs.readdirSync(membersDir).filter(f => f.endsWith('.md'));

  const members: Member[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(membersDir, file), 'utf-8');
    const member = parseMarkdown(content);

    if (member) {
      members.push({
        ...member,
        id: file.replace('.md', ''),
      });
    }
  }

  return members.sort((a, b) => {
    if (!a.joinDate && !b.joinDate) return 0;
    if (!a.joinDate) return 1;
    if (!b.joinDate) return -1;
    return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
  });
}

function parseMarkdown(content: string): Omit<Member, 'id'> | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = content.replace(/^---\n([\s\S]*?)\n---\n?/, '').trim();

  const nameMatch = frontmatter.match(/name:\s*"([^"]+)"/);
  const roleMatch = frontmatter.match(/role:\s*"([^"]+)"/);
  const genderMatch = frontmatter.match(/gender:\s*"([^"]+)"/);
  const ageMatch = frontmatter.match(/age:\s*"([^"]+)"/);
  const joinDateMatch = frontmatter.match(/joinDate:\s*"([^"]+)"/);
  const mbtiMatch = frontmatter.match(/mbti:\s*"([^"]+)"/);
  const zodiacMatch = frontmatter.match(/zodiac:\s*"([^"]+)"/);
  const avatarMatch = frontmatter.match(/avatar:\s*"([^"]+)"/);

  return {
    name: nameMatch ? nameMatch[1] : '',
    role: roleMatch ? roleMatch[1] : '',
    gender: genderMatch ? genderMatch[1] : '',
    age: ageMatch ? ageMatch[1] : '',
    joinDate: joinDateMatch ? joinDateMatch[1] : '',
    mbti: mbtiMatch ? mbtiMatch[1] : '',
    zodiac: zodiacMatch ? zodiacMatch[1] : '',
    avatar: avatarMatch ? avatarMatch[1] : undefined,
    responsibilities: body,
  };
}
