import fs from 'fs';
import path from 'path';

interface MemberData {
  name: string;
  role: string;
  gender: string;
  age: string;
  joinDate: string;
  responsibilities: string;
}

const outputDir = './src/content/members';

const members: MemberData[] = [
  {
    name: '林知然',
    role: '首席运营官',
    gender: '男',
    age: '28',
    joinDate: '',
    responsibilities: '待定',
  },
  {
    name: '欧蕾莉',
    role: '首席财务官',
    gender: '女',
    age: '28',
    joinDate: '',
    responsibilities: '待定',
  },
  {
    name: '温言',
    role: '首席增长官',
    gender: '女',
    age: '28',
    joinDate: '',
    responsibilities: '待定',
  },
  {
    name: '张澄',
    role: '战略顾问',
    gender: '男',
    age: '34',
    joinDate: '',
    responsibilities: '待定',
  },
  {
    name: '沈远致',
    role: '首席技术官',
    gender: '男',
    age: '34',
    joinDate: '2026-05-02',
    responsibilities: '待定',
  },
  {
    name: '欧雷',
    role: '核心成员',
    gender: '男',
    age: '',
    joinDate: '2026-05-04',
    responsibilities: '待定',
  },
];

const fileNameMap: Record<string, string> = {
  '林知然': 'lin-zhiran',
  '欧蕾莉': 'ou-leili',
  '温言': 'wen-yan',
  '张澄': 'zhang-cheng',
  '沈远致': 'shen-yuanzhi',
  '欧雷': 'ou-lei',
};

function generateMarkdown(member: MemberData): string {
  return `---
name: "${member.name}"
role: "${member.role}"
gender: "${member.gender}"
age: "${member.age}"
joinDate: "${member.joinDate}"
---

${member.responsibilities}`;
}

function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const member of members) {
    const fileName = fileNameMap[member.name] || member.name.toLowerCase();
    const outputPath = path.join(outputDir, `${fileName}.md`);
    const markdown = generateMarkdown(member);
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`Generated: ${outputPath}`);
  }

  console.log('All members generated successfully!');
}

main();