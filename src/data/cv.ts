// 簡歷資料：中英文頁面共用。改這裡，/cv/ 與 /en/cv/ 會一起更新。
// 文字欄位可以是同一字串（兩種語言相同），或 { zh, en }。可用 <strong>、<em> 等簡單 HTML。
// 空的區塊（items 為空陣列）不會顯示。

type Text = string | { zh: string; en: string };

export interface CvItem {
  when: Text;
  what: Text;
  note?: Text;
  href?: string;
}

export interface CvGroup {
  sub?: Text; // 區塊內的小標題
  items: CvItem[];
}

export interface CvSection {
  heading: { zh: string; en: string };
  groups: CvGroup[];
}

export const cvHead = {
  name: { zh: '陳亮', en: 'Liang Chen, MD' },
  title: {
    zh: '台北慈濟醫院 一般醫學訓練（PGY）醫師',
    en: 'PGY Physician, Taipei Tzu Chi Hospital, Taiwan',
  },
  interests: {
    zh: '臨床興趣：復健醫學、疼痛醫學、運動醫學',
    en: 'Interests: Physical Medicine & Rehabilitation, Pain Medicine, Sports Medicine',
  },
};

const REVIEWED = {
  zh: '審閱：Henry L. Lew 教授（夏威夷大學 John A. Burns 醫學院）、陳柏威醫師（花蓮慈濟醫院復健科）',
  en: 'Reviewed by Prof. Henry L. Lew (John A. Burns School of Medicine, University of Hawaiʻi) and Po-Wei Chen, MD (Hualien Tzu Chi Hospital)',
};

export const cv: CvSection[] = [
  {
    heading: { zh: '學歷', en: 'Education' },
    groups: [{ items: [
      {
        when: '2020–2026',
        what: { zh: '慈濟大學 醫學系', en: 'Tzu Chi University School of Medicine, Hualien, Taiwan' },
        note: { zh: '醫學士（M.D.）', en: 'Doctor of Medicine (M.D.)' },
      },
    ] }],
  },
  {
    heading: { zh: '臨床訓練', en: 'Clinical Training' },
    groups: [{ items: [
      {
        when: { zh: '2026–', en: '2026–present' },
        what: {
          zh: '佛教慈濟醫療財團法人台北慈濟醫院 二年期一般醫學訓練（PGY）',
          en: 'Postgraduate Year (PGY) Training, Taipei Tzu Chi Hospital, Buddhist Tzu Chi Medical Foundation',
        },
      },
    ] }],
  },
  {
    heading: { zh: '研究與發表', en: 'Publications' },
    groups: [
      {
        sub: { zh: '已發表', en: 'Published' },
        items: [
          {
            when: '2026',
            what: '<strong>Chen L</strong>, Hou WH, Riera R, Su CW, Horng YS. Transcutaneous electrical nerve stimulation (TENS) for chronic neck pain (Protocol). <em>Cochrane Database of Systematic Reviews</em> 2026, Issue 8. Art. No.: CD016383.',
            href: 'https://doi.org/10.1002/14651858.CD016383',
            note: { zh: '第一作者；全文系統性回顧進行中', en: 'First author. Full review in progress.' },
          },
        ],
      },
      {
        sub: { zh: '投稿中與撰寫中', en: 'Submitted & In Preparation' },
        items: [
          {
            when: '2026',
            what: 'Peng YN†, Huang D†, <strong>Chen L</strong>, Khor KS, Yen SC, Moen M, Winkle M, Gorgey AS. Efficacy of transcutaneous spinal cord stimulation on locomotor function in spinal cord injury: a systematic review and meta-analysis.',
            note: { zh: '投稿審查中；† 共同第一作者', en: 'Submitted. † Co-first authors' },
          },
          {
            when: '2026',
            what: '<strong>Chen L</strong>†, Cheng HY†, Chen SY, Huang LC, Chen LG, Wang JH, Lin SH. Divergent neural correlates of clinician-rated and self-reported depressive symptoms in Parkinson’s disease.',
            note: { zh: '投稿審查中；† 共同第一作者', en: 'Submitted. † Co-first authors' },
          },
          {
            when: '2026',
            what: 'Cheng HY†, <strong>Chen L</strong>†, Chen SY, Lin SH. Microstructural white matter alterations in Parkinson’s disease with depression: a systematic review of diffusion tensor imaging studies.',
            note: { zh: '投稿審查中；† 共同第一作者', en: 'Submitted. † Co-first authors' },
          },
          {
            when: '2026',
            what: '<strong>Chen L</strong>†, Huang D†, Khor KS, Peng YN, Yen SC, Limerick G, Babu AN, Tanaka MJ. Leukocyte-poor platelet-rich plasma versus hyaluronic acid for hip osteoarthritis: a systematic review and meta-analysis of randomized controlled trials.',
            note: { zh: '撰寫中；† 共同第一作者', en: 'In preparation. † Co-first authors' },
          },
          {
            when: '2026',
            what: 'Huang D†, <strong>Chen L</strong>†, Peng YN, Yen SC, Khor KS, Rhim HC‡, Tenforde A‡. Extracorporeal shockwave therapy (ESWT) and radial pressure waves (RPW) for Achilles tendinopathy: a systematic review and meta-analysis of randomized controlled trials comparing ESWT with sham and exercise therapy.',
            note: { zh: '撰寫中；† 共同第一作者；‡ 共同資深作者', en: 'In preparation. † Co-first authors; ‡ co-senior authors' },
          },
        ],
      },
    ],
  },
  {
    heading: { zh: '學術報告', en: 'Presentations' },
    groups: [{ items: [
      {
        when: { zh: '2026.05', en: 'May 2026' },
        what: '<strong>Chen L</strong>, Yen SC, Huang D, Khor KS, Peng YN, Gorgey A, Moen M, Winkle M. Efficacy of transcutaneous spinal cord stimulation for improving lower-limb function in spinal cord injury: a systematic review and meta-analysis of randomized controlled trials.',
        note: {
          zh: '海報發表（發表者）・CAPM&R / ISPRM 2026 World Congress，加拿大溫哥華',
          en: 'Research poster (presenting author). CAPM&R / ISPRM 2026 World Congress, Vancouver, Canada',
        },
      },
      {
        when: { zh: '2025.11', en: 'Nov 2025' },
        what: {
          zh: '<strong>陳亮</strong>、紀雙雙、周煜珉。擇期下消化道手術患者術日進行少量進食是否可縮短住院天數？使用實證性回顧探討。',
          en: '<strong>Chen L</strong>, et al. Does early oral intake on the day of elective lower gastrointestinal surgery shorten hospital stay? An evidence-based review.',
        },
        note: {
          zh: '口頭發表・2025 台灣實證醫學學會學術年會',
          en: 'Oral presentation. Taiwan Evidence-Based Medicine Association 2025 Annual Conference',
        },
      },
    ] }],
  },
  {
    heading: { zh: '研究計畫', en: 'Research Grants' },
    groups: [{ items: [
      {
        when: '2026',
        what: {
          zh: '佛教慈濟醫療財團法人 116 年度學生與教師合作研究計畫：經皮神經電刺激治療慢性頸痛之療效與安全性：考科藍回顧',
          en: 'Student–Faculty Collaborative Research Grant, Buddhist Tzu Chi Medical Foundation: Efficacy and safety of TENS for chronic neck pain, a Cochrane review',
        },
        note: { zh: '計畫主持人', en: 'Principal Investigator' },
      },
    ] }],
  },
  {
    heading: { zh: '海外臨床訪問與見習', en: 'International Clinical Visits & Exchange' },
    groups: [{ items: [
      {
        when: { zh: '2026.07', en: 'Jul 2026' },
        what: {
          zh: '訪問觀察員（Visiting Observer）：約翰霍普金斯醫院 Blaustein 疼痛治療中心（美國巴爾的摩）',
          en: 'Visiting Observer, Blaustein Pain Treatment Center, The Johns Hopkins Hospital, Baltimore, MD, USA',
        },
        note: { zh: '指導：Harold W. Burke, MD（疼痛醫學）', en: 'Supervisor: Harold W. Burke, MD (Pain Medicine)' },
      },
      {
        when: { zh: '2026.07', en: 'Jul 2026' },
        what: {
          zh: '訪問觀察員（Visiting Observer）：約翰霍普金斯 Bayview 醫學中心 復健科（美國巴爾的摩）',
          en: 'Visiting Observer, Physical Medicine & Rehabilitation, Johns Hopkins Bayview Medical Center, Baltimore, MD, USA',
        },
        note: { zh: '指導：Malcolm Winkle, MD（神經復健）', en: 'Supervisor: Malcolm Winkle, MD (Neurological Rehabilitation)' },
      },
      {
        when: { zh: '2026.07', en: 'Jul 2026' },
        what: {
          zh: '訪問觀察員（Visiting Observer）：麻省總醫院 運動醫學中心（美國波士頓）',
          en: 'Visiting Observer, Massachusetts General Hospital Sports Medicine, Boston, MA, USA',
        },
        note: { zh: '指導：Ashwin Babu, MD', en: 'Supervisor: Ashwin Babu, MD' },
      },
      {
        when: { zh: '2026.07', en: 'Jul 2026' },
        what: {
          zh: '訪問觀察員（Visiting Observer）：Mass General Brigham 運動醫學中心 Boston Landing（美國波士頓）',
          en: 'Visiting Observer, Mass General Brigham Sports Medicine at Boston Landing, Boston, MA, USA',
        },
        note: {
          zh: '指導：Adam S. Tenforde, MD（哈佛醫學院、Spaulding 復健醫院）',
          en: 'Supervisor: Adam S. Tenforde, MD (Harvard Medical School; Spaulding Rehabilitation Hospital)',
        },
      },
      {
        when: { zh: '2024.07', en: 'Jul 2024' },
        what: {
          zh: '海外臨床見習：IFMSA 國際醫學生交換計畫（SCOPE），Královské Vinohrady 大學醫院 麻醉科（捷克布拉格）',
          en: 'Clinical Clerkship Exchange, IFMSA Professional Exchange (SCOPE), Department of Anaesthesia, University Hospital Královské Vinohrady, Prague, Czech Republic',
        },
        note: { zh: '指導：Martin Kolář, MUDr., Ph.D.', en: 'Supervisor: Martin Kolář, MUDr., Ph.D.' },
      },
    ] }],
  },
  {
    heading: { zh: '獲獎', en: 'Honors & Awards' },
    groups: [{ items: [
      {
        when: '2025',
        what: {
          zh: '2025 國家臨床醫學教育獎（NCMEA）實證醫學類 實證新人組 佳作',
          en: 'Honorable Mention, Evidence-Based Medicine (Novice), National Clinical Medical Education Award (NCMEA) 2025',
        },
        note: { zh: '財團法人醫院評鑑暨醫療品質策進會', en: 'Joint Commission of Taiwan' },
      },
      {
        when: '2025',
        what: {
          zh: '慈濟跨院區實證醫學文獻查證競賽 新人組金獎',
          en: 'Gold Award (Novice), Tzu Chi Cross-Hospital Evidence-Based Medicine Competition',
        },
      },
      {
        when: '2025',
        what: {
          zh: '花蓮慈濟醫院 院內實證醫學文獻查證競賽 銀獎',
          en: 'Silver Award, Hualien Tzu Chi Hospital Evidence-Based Medicine Competition',
        },
      },
      {
        when: '2025',
        what: {
          zh: '約翰霍普金斯大學徐達雄教授特別獎（花蓮慈濟醫院內科部）',
          en: 'Dr. Tah-Hsiung Hsu Award for Excellent Effort and Learning in Internal Medicine Rotation, Hualien Tzu Chi Hospital',
        },
      },
      {
        when: '2024',
        what: {
          zh: '教育部 青年志工行動競賽（青志獎）績優服務獎（慈濟大學偏鄉教育服務學習團隊）',
          en: 'Outstanding Service Award, Youth Volunteer Team Competition, Ministry of Education, Taiwan (team member)',
        },
      },
      {
        when: '2022–2025',
        what: {
          zh: '慈濟大學 書卷獎 ×4、績優學生獎 ×1',
          en: 'Tzu Chi University Award of Excellence ×4 and Outstanding Student Award ×1',
        },
      },
    ] }],
  },
  {
    heading: { zh: '教學', en: 'Teaching' },
    groups: [{ items: [
      {
        when: '2025',
        what: {
          zh: '花蓮慈濟醫院實證醫學中心「實證醫學初階工作坊」助教（2 場）',
          en: 'Teaching Assistant, Basic Evidence-Based Medicine Workshop, Hualien Tzu Chi Hospital (2 sessions)',
        },
      },
      {
        when: '2025',
        what: {
          zh: '教學影片：Lower Back Pain Anatomy & Clinical Exam',
          en: 'Teaching video: Lower Back Pain Anatomy & Clinical Exam',
        },
        href: 'https://youtu.be/0iDiFkx06iQ',
        note: REVIEWED,
      },
      {
        when: '2026',
        what: {
          zh: '教學影片：Cervical Spine Anatomy and Clinical Exam',
          en: 'Teaching video: Cervical Spine Anatomy and Clinical Exam',
        },
        href: 'https://youtu.be/0JWfsCrKv7s',
        note: REVIEWED,
      },
    ] }],
  },
  {
    heading: { zh: '證照', en: 'Certifications' },
    groups: [{ items: [
      { when: '2025', what: { zh: '高級心臟救命術（ACLS）', en: 'Advanced Cardiovascular Life Support (ACLS)' } },
      { when: '2025', what: { zh: 'ETTC 證書（外傷繼續教育 16 小時）', en: 'ETTC Certificate (16 hours of trauma CME)' } },
      { when: '2025', what: { zh: '經濟部 AI 應用規劃師（初級）', en: 'AI Application Planner, Associate Level, Ministry of Economic Affairs, Taiwan' } },
      { when: '2020', what: { zh: '多益 TOEIC 聽力與閱讀 970 分', en: 'TOEIC Listening & Reading: 970' } },
    ] }],
  },
  {
    heading: { zh: '學會', en: 'Memberships' },
    groups: [{ items: [
      { when: { zh: '2026–', en: '2026–present' }, what: { zh: 'Cochrane 會員', en: 'Member, Cochrane' } },
      {
        when: { zh: '2026–', en: '2026–present' },
        what: { zh: '國際物理與復健醫學會（ISPRM）會員', en: 'Member, International Society of Physical and Rehabilitation Medicine (ISPRM)' },
      },
    ] }],
  },
];
