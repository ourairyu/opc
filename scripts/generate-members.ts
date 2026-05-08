import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface BasicYmlData {
  name: string;
  gender: number;
  birthday: string;
  joined_at: string;
  company_title: string;
  mbti: string;
  description: string;
}

interface MemberData {
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

const agentTeamPath = '/Users/oreilia/Repositories/personal/l0y1/databases/agent-team/spaces/team/members';
const membersOutputDir = './src/content/members';
const avatarsOutputDir = './public/avatars';

const dirNameToKebab: Record<string, string> = {
  'lin-zhiran': 'lin-zhiran',
  'ou-lei': 'ou-lei',
  'ou-leili': 'ou-leili',
  'shen-yuanzhi': 'shen-yuanzhi',
  'wen-yan': 'wen-yan',
  'zhang-cheng': 'zhang-cheng',
};

function calculateAge(birthdayStr: string): string {
  const birthday = new Date(birthdayStr);
  const currentYear = 2026;
  const birthYear = birthday.getFullYear();
  return String(currentYear - birthYear);
}

function getZodiacEmoji(birthdayStr: string): string {
  const birthday = new Date(birthdayStr);
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();
  const date = month * 100 + day;

  if (date >= 321 && date <= 419) return '♈';
  if (date >= 420 && date <= 520) return '♉';
  if (date >= 521 && date <= 621) return '♊';
  if (date >= 622 && date <= 722) return '♋';
  if (date >= 723 && date <= 822) return '♌';
  if (date >= 823 && date <= 922) return '♍';
  if (date >= 923 && date <= 1023) return '♎';
  if (date >= 1024 && date <= 1122) return '♏';
  if (date >= 1123 && date <= 1221) return '♐';
  if (date >= 1222 || date <= 119) return '♑';
  if (date >= 120 && date <= 218) return '♒';
  if (date >= 219 && date <= 320) return '♓';
  return '♐';
}

function formatJoinDate(joinedAt: string): string {
  const date = new Date(joinedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getGenderString(gender: number): string {
  return gender === 0 ? '女' : '男';
}

function generateMarkdown(member: MemberData): string {
  let frontmatter = `name: "${member.name}"
role: "${member.role}"
gender: "${member.gender}"
age: "${member.age}"
joinDate: "${member.joinDate}"
mbti: "${member.mbti}"
zodiac: "${member.zodiac}"`;

  if (member.avatar) {
    frontmatter += `\navatar: "${member.avatar}"`;
  }

  return `---
${frontmatter}
---

${member.responsibilities}`;
}

function main() {
  if (!fs.existsSync(membersOutputDir)) {
    fs.mkdirSync(membersOutputDir, { recursive: true });
  }
  if (!fs.existsSync(avatarsOutputDir)) {
    fs.mkdirSync(avatarsOutputDir, { recursive: true });
  }

  const memberDirs = fs.readdirSync(agentTeamPath).filter(dir =>
    fs.statSync(path.join(agentTeamPath, dir)).isDirectory()
  );

  for (const dirName of memberDirs) {
    const memberDir = path.join(agentTeamPath, dirName);
    const basicYmlPath = path.join(memberDir, 'basic.yml');

    if (!fs.existsSync(basicYmlPath)) continue;

    const basicYmlContent = fs.readFileSync(basicYmlPath, 'utf-8');
    const basicData = yaml.load(basicYmlContent) as BasicYmlData;

    const avatarSrcPath = path.join(memberDir, 'avatar.jpg');
    const kebabName = dirNameToKebab[dirName] || dirName;
    let avatarPath: string | undefined;

    if (fs.existsSync(avatarSrcPath)) {
      avatarPath = `/avatars/${kebabName}.jpg`;
      fs.copyFileSync(avatarSrcPath, path.join(avatarsOutputDir, `${kebabName}.jpg`));
    }

    const member: MemberData = {
      name: basicData.name,
      role: basicData.company_title,
      gender: getGenderString(basicData.gender),
      age: calculateAge(basicData.birthday),
      joinDate: formatJoinDate(basicData.joined_at),
      responsibilities: basicData.description,
      mbti: basicData.mbti,
      zodiac: getZodiacEmoji(basicData.birthday),
      avatar: avatarPath,
    };

    const outputPath = path.join(membersOutputDir, `${kebabName}.md`);
    const markdown = generateMarkdown(member);
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`Generated: ${outputPath}`);
  }

  console.log('All members generated successfully!');
}

main();
