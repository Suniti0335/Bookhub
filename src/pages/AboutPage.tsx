interface Member {
  name: string;
  studentId: string;
  role: string;
  /** URL รูปภาพ (ว่างไว้จะแสดงตัวอักษรแรกของชื่อแทน) */
  photoUrl?: string;
}

// ข้อมูลที่แสดงในการ์ดสมาชิก; รูปอยู่ใน public/members/
const MEMBERS: Member[] = [
  { name: 'สุนิธิ โพธิ์ทอง', studentId: '1660700336', role: 'Frontend', photoUrl: '/members/1.jpg' },
  { name: 'ไชยวุฒิ ณ ปัญโญ', studentId: '1660700855', role: 'Backend', photoUrl: '/members/2.jpg' },
  { name: 'เลปวรรณ อ๋อนศิริ', studentId: '1660703370', role: 'Presentation', photoUrl: '/members/3.jpg' },
];

// แสดงที่มาของ API/รูปปกและลิงก์เอกสาร; เพิ่มแหล่งข้อมูลใหม่ใน array นี้
const API_SOURCES = [
  {
    name: 'json-server',
    description: 'Mock REST API สำหรับข้อมูลหนังสือ (/books) และคำสั่งซื้อ (/orders) จากไฟล์ db.json',
    url: 'https://github.com/typicode/json-server',
  },
  {
    name: 'Open Library Covers API',
    description: 'รูปปกหนังสือจาก Open Library Covers API',
    url: 'https://openlibrary.org/dev/docs/api/covers',
  },
];

/** หน้าแนะนำผู้พัฒนาและแหล่งข้อมูลที่ใช้ในโปรเจกต์ */
export default function AboutPage() {
  return (
    <section className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">เกี่ยวกับเรา</h1>
        <p className="mt-2 max-w-2xl opacity-70">
          BookHub ร้านหนังสือออนไลน์ สร้างด้วย React, TanStack Query, Zustand, React Router, Tailwind CSS และ daisyUI
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">สมาชิกในกลุ่ม</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((member, i) => (
            <div key={`${member.studentId}-${i}`} className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center">
                <div className="avatar avatar-placeholder">
                  <div className="w-24 rounded-full bg-primary text-primary-content">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="object-cover" />
                    ) : (
                      <span className="text-3xl">{member.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <h3 className="card-title mt-2">{member.name}</h3>
                <p className="font-mono text-sm opacity-70">{member.studentId}</p>
                <p className="text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">แหล่งที่มาของข้อมูล / API</h2>
        <ul className="flex flex-col gap-3">
          {API_SOURCES.map((source) => (
            <li key={source.name} className="card bg-base-100 shadow-sm">
              <div className="card-body gap-1 p-5">
                <a href={source.url} target="_blank" rel="noreferrer" className="link link-primary font-semibold">
                  {source.name}
                </a>
                <p className="text-sm opacity-70">{source.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
