import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash("Aeb2026!!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@aebhukuk.com" },
    update: {},
    create: {
      email: "admin@aebhukuk.com",
      passwordHash,
      name: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  // Create categories
  const categories = [
    { slug: "ceza-hukuku", nameTr: "Ceza Hukuku", nameEn: "Criminal Law", order: 1 },
    { slug: "aile-hukuku", nameTr: "Aile Hukuku", nameEn: "Family Law", order: 2 },
    { slug: "is-hukuku", nameTr: "İş Hukuku", nameEn: "Labor Law", order: 3 },
    { slug: "ticaret-hukuku", nameTr: "Ticaret Hukuku", nameEn: "Commercial Law", order: 4 },
    { slug: "idare-hukuku", nameTr: "İdare Hukuku", nameEn: "Administrative Law", order: 5 },
    { slug: "gayrimenkul-hukuku", nameTr: "Gayrimenkul Hukuku", nameEn: "Real Estate Law", order: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create tags
  const tags = [
    { slug: "dava", nameTr: "Dava", nameEn: "Lawsuit" },
    { slug: "sozlesme", nameTr: "Sözleşme", nameEn: "Contract" },
    { slug: "tazminat", nameTr: "Tazminat", nameEn: "Compensation" },
    { slug: "bosanma", nameTr: "Boşanma", nameEn: "Divorce" },
    { slug: "miras", nameTr: "Miras", nameEn: "Inheritance" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  // Create site settings
  const settings = [
    { key: "site_title", valueTr: "Hukuk Bürosu", valueEn: "Law Firm", group: "general" },
    { key: "site_description", valueTr: "Profesyonel Hukuki Danışmanlık", valueEn: "Professional Legal Consulting", group: "general" },
    { key: "phone", valueTr: "+90 212 123 45 67", group: "contact" },
    { key: "phone_raw", valueTr: "+902121234567", group: "contact" },
    { key: "whatsapp", valueTr: "+905551234567", group: "contact" },
    { key: "email", valueTr: "info@hukukburosu.com", group: "contact" },
    { key: "address", valueTr: "Levent Mah. Hukuk Sok. No:1 Kat:5, Beşiktaş/İstanbul", valueEn: "Levent Mah. Hukuk Sok. No:1 Floor:5, Besiktas/Istanbul", group: "contact" },
    { key: "maps_embed_url", valueTr: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2!2d29.01!3d41.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLevent!5e0!3m2!1str!2str!4v1234567890", group: "contact" },
    { key: "working_hours", valueTr: "Pazartesi - Cuma: 09:00 - 18:00", valueEn: "Monday - Friday: 09:00 - 18:00", group: "contact" },
    { key: "working_hours_saturday", valueTr: "Cumartesi: Randevu ile", valueEn: "Saturday: By Appointment", group: "contact" },
    // Stats
    { key: "stat_experience_value", valueTr: "20", group: "stats" },
    { key: "stat_experience_suffix", valueTr: "+", group: "stats" },
    { key: "stat_experience_label", valueTr: "Yıllık Deneyim", valueEn: "Years of Experience", group: "stats" },
    { key: "stat_cases_value", valueTr: "5000", group: "stats" },
    { key: "stat_cases_suffix", valueTr: "+", group: "stats" },
    { key: "stat_cases_label", valueTr: "Başarılı Dava", valueEn: "Successful Cases", group: "stats" },
    { key: "stat_clients_value", valueTr: "3000", group: "stats" },
    { key: "stat_clients_suffix", valueTr: "+", group: "stats" },
    { key: "stat_clients_label", valueTr: "Mutlu Müvekkil", valueEn: "Happy Clients", group: "stats" },
    // About
    { key: "about_description", valueTr: "20 yılı aşkın tecrübemizle, müvekkillerimize en yüksek kalitede hukuki danışmanlık ve avukatlık hizmeti sunuyoruz. Etik değerlere bağlılığımız ve müvekkil memnuniyeti odaklı yaklaşımımızla, hukuki süreçlerinizde güvenilir çözüm ortağınızız.", valueEn: "With over 20 years of experience, we provide our clients with the highest quality legal advice and advocacy services. With our commitment to ethical values and client satisfaction-oriented approach, we are your reliable solution partner in your legal processes.", group: "about" },
    // CTA
    { key: "cta_title", valueTr: "Hukuki Sorununuzu Çözelim", valueEn: "Let us solve your legal problem", group: "cta" },
    { key: "cta_subtitle", valueTr: "İlk görüşme ücretsizdir. Hemen bizimle iletişime geçin.", valueEn: "The first meeting is free of charge. Contact us now.", group: "cta" },
    { key: "cta_button_text", valueTr: "Randevu Alın", valueEn: "Make an Appointment", group: "cta" },
    { key: "cta_phone_text", valueTr: "Bizi Arayın", valueEn: "Call Us", group: "cta" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Create team members
  const teamMembers = [
    {
      nameTr: "Av. Ahmet Yılmaz",
      nameEn: "Av. Ahmet Yılmaz",
      roleTr: "Kurucu Ortak",
      roleEn: "Founding Partner",
      specialtyTr: "Ceza Hukuku",
      specialtyEn: "Criminal Law",
      order: 1,
    },
    {
      nameTr: "Av. Elif Kaya",
      nameEn: "Av. Elif Kaya",
      roleTr: "Kıdemli Avukat",
      roleEn: "Senior Lawyer",
      specialtyTr: "Aile Hukuku",
      specialtyEn: "Family Law",
      order: 2,
    },
    {
      nameTr: "Av. Mehmet Demir",
      nameEn: "Av. Mehmet Demir",
      roleTr: "Kıdemli Avukat",
      roleEn: "Senior Lawyer",
      specialtyTr: "İş Hukuku",
      specialtyEn: "Labor Law",
      order: 3,
    },
    {
      nameTr: "Av. Zeynep Arslan",
      nameEn: "Av. Zeynep Arslan",
      roleTr: "Avukat",
      roleEn: "Lawyer",
      specialtyTr: "Ticaret Hukuku",
      specialtyEn: "Commercial Law",
      order: 4,
    },
  ];

  // Upsert by checking existing members by name
  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { nameTr: member.nameTr },
    });
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: member,
      });
    } else {
      await prisma.teamMember.create({ data: member });
    }
  }

  // Create FAQ items
  const faqItems = [
    {
      questionTr: "İlk görüşme ücretsiz mi?",
      questionEn: "Is the first call free?",
      answerTr: "Evet, ilk hukuki danışmanlık görüşmemiz ücretsizdir. Bu görüşmede davanızı değerlendirir ve size en uygun çözüm yolunu belirleriz.",
      answerEn: "Yes, our first legal consultation is free of charge. During this consultation, we will assess your case and determine the most appropriate solution for you.",
      order: 1,
    },
    {
      questionTr: "Dava süreci ne kadar sürer?",
      questionEn: "How long does the court process take?",
      answerTr: "Dava süresi, davanın türüne ve karmaşıklığına göre değişir. İlk görüşmede tahmini bir süre hakkında sizi bilgilendiririz.",
      answerEn: "The duration of the case depends on the type and complexity of the case. We will inform you about an estimated duration at the first consultation.",
      order: 2,
    },
    {
      questionTr: "Avukatlık ücretleri nasıl belirlenir?",
      questionEn: "How are attorneys' fees determined?",
      answerTr: "Avukatlık ücretleri, davanın niteliğine göre belirlenir. İstanbul Barosu asgari ücret tarifesi temel alınarak, davanızın özelliklerine uygun bir ücret teklifi sunulur.",
      answerEn: "Attorney fees are determined according to the nature of the case. Based on the minimum fee tariff of the Istanbul Bar Association, a fee proposal is presented in accordance with the characteristics of your case.",
      order: 3,
    },
    {
      questionTr: "Online danışmanlık hizmeti veriyor musunuz?",
      questionEn: "Do you provide online counseling services?",
      answerTr: "Evet, yurt içi ve yurt dışındaki müvekkillerimize video konferans aracılığıyla online hukuki danışmanlık hizmeti sunmaktayız.",
      answerEn: "Yes, we provide online legal advice to our domestic and international clients via video conferencing.",
      order: 4,
    },
    {
      questionTr: "Hangi hukuk alanlarında hizmet veriyorsunuz?",
      questionEn: "In which areas of law do you provide services?",
      answerTr: "Ceza hukuku, aile hukuku, iş hukuku, ticaret hukuku, idare hukuku ve gayrimenkul hukuku başta olmak üzere geniş bir yelpazede hukuki hizmet sunmaktayız.",
      answerEn: "We provide a wide range of legal services including criminal law, family law, labor law, commercial law, administrative law and real estate law.",
      order: 5,
    },
  ];

  for (const faq of faqItems) {
    const existing = await prisma.faqItem.findFirst({
      where: { questionTr: faq.questionTr },
    });
    if (existing) {
      await prisma.faqItem.update({
        where: { id: existing.id },
        data: faq,
      });
    } else {
      await prisma.faqItem.create({ data: faq });
    }
  }

  // Create practice areas
  const practiceAreas = [
    {
      slug: "ceza-hukuku",
      titleTr: "Ceza Hukuku",
      titleEn: "Criminal Law",
      descriptionTr: "Ceza davalarında savunma, soruşturma süreçleri ve tutukluluk halleri konusunda uzman destek.",
      descriptionEn: "Expert support on defense, investigation processes and detention in criminal cases.",
      longDescTr: "Ceza hukuku alanında uzman avukatlarımız, müvekkillerimizin haklarını en etkin şekilde korumak için çalışmaktadır. Soruşturma aşamasından yargılama sürecine kadar her adımda yanınızdayız. Deneyimli ekibimiz, ceza davalarında güçlü bir savunma stratejisi oluşturarak en iyi sonucu elde etmeyi hedefler.",
      longDescEn: "Our expert lawyers in criminal law work to protect our clients' rights in the most effective way. We are by your side at every step, from the investigation phase to the trial process. Our experienced team aims to achieve the best result by creating a strong defense strategy in criminal cases.",
      icon: "Shield",
      itemsTr: "Ağır Ceza Davaları\nSoruşturma Süreçleri\nTutukluluk İtirazları\nCeza Temyiz\nUzlaştırma",
      itemsEn: "Serious Criminal Cases\nInvestigation Processes\nDetention Objections\nCriminal Appeals\nMediation",
      order: 1,
    },
    {
      slug: "aile-hukuku",
      titleTr: "Aile Hukuku",
      titleEn: "Family Law",
      descriptionTr: "Boşanma, velayet, nafaka ve mal paylaşımı davalarında hukuki danışmanlık.",
      descriptionEn: "Legal counseling in divorce, custody, alimony and property division cases.",
      longDescTr: "Aile hukuku alanında hassas ve profesyonel yaklaşımımızla müvekkillerimizin yanındayız. Boşanma, velayet, nafaka ve mal paylaşımı gibi konularda haklarınızı koruyarak en adil çözüme ulaşmanızı sağlıyoruz. Arabuluculuk ve dava süreçlerinde deneyimli ekibimiz sizinle birlikte çalışır.",
      longDescEn: "We stand by our clients with a sensitive and professional approach in family law. We ensure that you reach the fairest solution by protecting your rights in matters such as divorce, custody, alimony and property division. Our experienced team works with you through mediation and litigation processes.",
      icon: "Heart",
      itemsTr: "Anlaşmalı Boşanma\nÇekişmeli Boşanma\nVelayet Davaları\nNafaka Davaları\nMal Paylaşımı",
      itemsEn: "Uncontested Divorce\nContested Divorce\nCustody Cases\nAlimony Cases\nProperty Division",
      order: 2,
    },
    {
      slug: "is-hukuku",
      titleTr: "İş Hukuku",
      titleEn: "Labor Law",
      descriptionTr: "İşçi-işveren uyuşmazlıkları, iş kazaları ve tazminat davaları.",
      descriptionEn: "Employer-employee disputes, work accidents and compensation cases.",
      longDescTr: "İş hukuku alanında işçi ve işveren haklarını korumak için kapsamlı hukuki hizmet sunuyoruz. İş sözleşmelerinden tazminat davalarına, iş kazalarından sendikal haklara kadar geniş bir yelpazede deneyimli kadromuzla yanınızdayız.",
      longDescEn: "We provide comprehensive legal services to protect the rights of both employees and employers in labor law. From employment contracts to compensation cases, from work accidents to union rights, we are by your side with our experienced team across a wide range of issues.",
      icon: "Briefcase",
      itemsTr: "İşe İade Davaları\nKıdem Tazminatı\nİhbar Tazminatı\nİş Kazası Davaları\nMobbing Davaları",
      itemsEn: "Reinstatement Cases\nSeverance Pay\nNotice Pay\nWork Accident Cases\nMobbing Cases",
      order: 3,
    },
    {
      slug: "ticaret-hukuku",
      titleTr: "Ticaret Hukuku",
      titleEn: "Commercial Law",
      descriptionTr: "Şirket kuruluşu, ticari sözleşmeler ve ticari uyuşmazlıkların çözümü.",
      descriptionEn: "Company establishment, commercial contracts and commercial dispute resolution.",
      longDescTr: "Ticaret hukuku alanında şirketlerin ihtiyaç duyduğu tüm hukuki hizmetleri sunuyoruz. Şirket kuruluşu, birleşme ve devralmalar, ticari sözleşmelerin hazırlanması ve ticari uyuşmazlıkların çözümünde uzman kadromuzla yanınızdayız.",
      longDescEn: "We provide all legal services that companies need in commercial law. We are by your side with our expert team in company establishment, mergers and acquisitions, preparation of commercial contracts, and resolution of commercial disputes.",
      icon: "Building2",
      itemsTr: "Şirket Kuruluşu\nBirleşme ve Devralma\nTicari Sözleşmeler\nİflas ve Konkordato\nHaksız Rekabet",
      itemsEn: "Company Formation\nMergers and Acquisitions\nCommercial Contracts\nBankruptcy and Concordat\nUnfair Competition",
      order: 4,
    },
    {
      slug: "idare-hukuku",
      titleTr: "İdare Hukuku",
      titleEn: "Administrative Law",
      descriptionTr: "İdari işlem ve eylemlere karşı iptal davaları ve tam yargı davaları.",
      descriptionEn: "Annulment actions and full judgment actions against administrative acts and actions.",
      longDescTr: "İdare hukuku alanında bireylerin ve kurumların kamu idaresi karşısındaki haklarını korumak için çalışıyoruz. İdari işlemlerin iptali, tam yargı davaları ve idari sözleşmelerden kaynaklanan uyuşmazlıklarda uzman kadromuzla hizmet veriyoruz.",
      longDescEn: "We work to protect the rights of individuals and institutions against public administration in administrative law. We provide services with our expert team in annulment of administrative actions, full judgment lawsuits, and disputes arising from administrative contracts.",
      icon: "Landmark",
      itemsTr: "İptal Davaları\nTam Yargı Davaları\nİdari Sözleşmeler\nKamulaştırma Davaları\nVergi Davaları",
      itemsEn: "Annulment Actions\nFull Judgment Actions\nAdministrative Contracts\nExpropriation Cases\nTax Cases",
      order: 5,
    },
    {
      slug: "gayrimenkul-hukuku",
      titleTr: "Gayrimenkul Hukuku",
      titleEn: "Real Estate Law",
      descriptionTr: "Tapu işlemleri, kira uyuşmazlıkları ve imar hukuku konularında destek.",
      descriptionEn: "Support in land registry transactions, lease disputes and zoning law.",
      longDescTr: "Gayrimenkul hukuku alanında taşınmaz alım-satımından kira uyuşmazlıklarına, imar hukukundan kat mülkiyetine kadar geniş bir alanda hukuki danışmanlık sunuyoruz. Mülkiyet haklarınızı korumak ve gayrimenkul işlemlerinizi güvence altına almak için yanınızdayız.",
      longDescEn: "We provide legal consultancy in a wide range of real estate law, from property purchase and sale to lease disputes, from zoning law to condominium ownership. We are by your side to protect your property rights and secure your real estate transactions.",
      icon: "Home",
      itemsTr: "Tapu İşlemleri\nKira Uyuşmazlıkları\nİmar Hukuku\nKat Mülkiyeti\nTahliye Davaları",
      itemsEn: "Land Registry Transactions\nLease Disputes\nZoning Law\nCondominium Ownership\nEviction Cases",
      order: 6,
    },
  ];

  for (const area of practiceAreas) {
    await prisma.practiceArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: area,
    });
  }

  // Create sample blog posts
  const allCategories = await prisma.category.findMany();
  const catMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  const blogPosts = [
    {
      slug: "ceza-hukukunda-temel-haklar",
      titleTr: "Ceza Hukukunda Temel Haklar",
      titleEn: "Fundamental Rights in Criminal Law",
      contentTr: "<h2>Ceza Hukukunda Temel Haklar</h2><p>Ceza hukuku, bireylerin temel haklarını koruma altına alan hukuk dallarından biridir. Bu yazıda, sanık haklarından başlayarak, ceza yargılamasında dikkat edilmesi gereken temel ilkeleri inceleyeceğiz.</p><h3>Masumiyet Karinesi</h3><p>Herkes, suçluluğu kanıtlanana kadar masum kabul edilir. Bu ilke, ceza yargılamasının en temel prensiplerinden biridir ve Anayasa'nın 38. maddesinde güvence altına alınmıştır.</p><h3>Savunma Hakkı</h3><p>Her bireyin, hakkındaki suçlamalara karşı savunma yapma hakkı bulunmaktadır. Bu hak, avukat yardımından yararlanma hakkını da kapsamaktadır.</p>",
      contentEn: "<h2>Fundamental Rights in Criminal Law</h2><p>Criminal law is one of the branches of law that protects the fundamental rights of individuals. In this article, we will examine the basic principles to be considered in criminal proceedings, starting with the rights of the accused.</p><h3>Presumption of Innocence</h3><p>Everyone is presumed innocent until proven guilty. This principle is one of the most fundamental principles of criminal proceedings and is guaranteed by Article 38 of the Constitution.</p><h3>Right of Defense</h3><p>Every individual has the right to defend against the charges brought against them. This right also includes the right to benefit from legal counsel.</p>",
      excerptTr: "Ceza hukukunda sanık hakları ve temel ilkeler hakkında kapsamlı bir inceleme.",
      excerptEn: "A comprehensive examination of the rights of the accused and fundamental principles in criminal law.",
      categorySlug: "ceza-hukuku",
      publishedAt: new Date("2025-12-15"),
    },
    {
      slug: "bosanma-surecinde-bilinmesi-gerekenler",
      titleTr: "Boşanma Sürecinde Bilinmesi Gerekenler",
      titleEn: "What You Need to Know About Divorce Proceedings",
      contentTr: "<h2>Boşanma Sürecinde Bilinmesi Gerekenler</h2><p>Boşanma süreci, hem hukuki hem de duygusal açıdan zorlu bir dönemdir. Bu yazıda, boşanma sürecinde haklarınızı ve dikkat etmeniz gereken noktaları ele alacağız.</p><h3>Anlaşmalı Boşanma</h3><p>Anlaşmalı boşanma, eşlerin boşanma ve sonuçları konusunda mutabık kalmaları halinde başvurabilecekleri en hızlı yoldur. Evliliğin en az bir yıl sürmüş olması gerekmektedir.</p><h3>Çekişmeli Boşanma</h3><p>Eşlerin anlaşamadığı durumlarda çekişmeli boşanma davası açılır. Bu süreçte velayet, nafaka ve mal paylaşımı gibi konular mahkeme tarafından karara bağlanır.</p>",
      contentEn: "<h2>What You Need to Know About Divorce Proceedings</h2><p>The divorce process is a challenging period both legally and emotionally. In this article, we will discuss your rights and important points to consider during divorce proceedings.</p><h3>Uncontested Divorce</h3><p>Uncontested divorce is the fastest route when spouses agree on divorce and its consequences. The marriage must have lasted at least one year.</p><h3>Contested Divorce</h3><p>When spouses cannot reach an agreement, a contested divorce case is filed. In this process, issues such as custody, alimony, and property division are decided by the court.</p>",
      excerptTr: "Boşanma sürecinde haklarınız, anlaşmalı ve çekişmeli boşanma farkları hakkında bilgilendirici rehber.",
      excerptEn: "An informative guide about your rights during divorce, and the differences between contested and uncontested divorce.",
      categorySlug: "aile-hukuku",
      publishedAt: new Date("2025-11-28"),
    },
    {
      slug: "iscinin-kidem-tazminati-haklari",
      titleTr: "İşçinin Kıdem Tazminatı Hakları",
      titleEn: "Employee Severance Pay Rights",
      contentTr: "<h2>İşçinin Kıdem Tazminatı Hakları</h2><p>Kıdem tazminatı, işçinin en önemli mali haklarından biridir. Bu yazıda, kıdem tazminatına hak kazanma koşullarını ve hesaplama yöntemlerini inceleyeceğiz.</p><h3>Hak Kazanma Koşulları</h3><p>Kıdem tazminatına hak kazanabilmek için işçinin aynı işverene bağlı olarak en az bir yıl çalışmış olması gerekmektedir. İş sözleşmesinin belirli nedenlerle sona ermesi halinde bu hak doğar.</p><h3>Hesaplama Yöntemi</h3><p>Kıdem tazminatı, işçinin her bir tam çalışma yılı için son brüt ücreti üzerinden hesaplanır. Kıdem tazminatı tavanı her yıl güncellenmektedir.</p>",
      contentEn: "<h2>Employee Severance Pay Rights</h2><p>Severance pay is one of the most important financial rights of employees. In this article, we will examine the conditions for eligibility and calculation methods for severance pay.</p><h3>Eligibility Conditions</h3><p>To be eligible for severance pay, the employee must have worked for the same employer for at least one year. This right arises when the employment contract is terminated for certain reasons.</p><h3>Calculation Method</h3><p>Severance pay is calculated based on the employee's last gross salary for each full year of employment. The severance pay ceiling is updated annually.</p>",
      excerptTr: "Kıdem tazminatına hak kazanma koşulları ve hesaplama yöntemleri hakkında detaylı bilgi.",
      excerptEn: "Detailed information about severance pay eligibility conditions and calculation methods.",
      categorySlug: "is-hukuku",
      publishedAt: new Date("2025-11-10"),
    },
    {
      slug: "ticari-sozlesmelerde-dikkat-edilmesi-gerekenler",
      titleTr: "Ticari Sözleşmelerde Dikkat Edilmesi Gerekenler",
      titleEn: "Key Points in Commercial Contracts",
      contentTr: "<h2>Ticari Sözleşmelerde Dikkat Edilmesi Gerekenler</h2><p>Ticari sözleşmeler, iş dünyasının temel taşlarından biridir. Doğru hazırlanmış bir sözleşme, ticari ilişkilerde güvenin teminatıdır.</p><h3>Sözleşme Unsurları</h3><p>Her ticari sözleşmede tarafların hak ve yükümlülükleri açıkça belirtilmelidir. Cezai şartlar, ödeme koşulları ve fesih maddeleri özenle düzenlenmelidir.</p><h3>Uyuşmazlık Çözümü</h3><p>Sözleşmelerde uyuşmazlık halinde başvurulacak yöntem ve yetkili mahkeme mutlaka belirlenmelidir. Arabuluculuk ve tahkim alternatifleri de değerlendirilmelidir.</p>",
      contentEn: "<h2>Key Points in Commercial Contracts</h2><p>Commercial contracts are one of the cornerstones of the business world. A properly prepared contract is the guarantee of trust in commercial relationships.</p><h3>Contract Elements</h3><p>In every commercial contract, the rights and obligations of the parties must be clearly stated. Penalty clauses, payment terms, and termination provisions must be carefully drafted.</p><h3>Dispute Resolution</h3><p>The method to be applied in case of dispute and the competent court must be determined in contracts. Mediation and arbitration alternatives should also be considered.</p>",
      excerptTr: "Ticari sözleşmelerin hazırlanmasında dikkat edilmesi gereken temel hususlar ve öneriler.",
      excerptEn: "Key considerations and recommendations in the preparation of commercial contracts.",
      categorySlug: "ticaret-hukuku",
      publishedAt: new Date("2025-10-20"),
    },
    {
      slug: "idari-yargilama-sureci-ve-haklariniz",
      titleTr: "İdari Yargılama Süreci ve Haklarınız",
      titleEn: "Administrative Litigation Process and Your Rights",
      contentTr: "<h2>İdari Yargılama Süreci ve Haklarınız</h2><p>İdari yargılama, vatandaşların devlet işlemlerine karşı başvurabilecekleri önemli bir hukuki mekanizmadır.</p><h3>İptal Davası</h3><p>Hukuka aykırı olduğu düşünülen idari işlemlere karşı iptal davası açılabilir. Dava açma süresi, işlemin tebliğinden itibaren genellikle 60 gündür.</p><h3>Tam Yargı Davası</h3><p>İdari işlem veya eylemler nedeniyle uğranılan zararların tazmini için tam yargı davası açılabilir. Bu dava, iptal davasıyla birlikte veya ayrı olarak açılabilir.</p>",
      contentEn: "<h2>Administrative Litigation Process and Your Rights</h2><p>Administrative litigation is an important legal mechanism through which citizens can challenge government actions.</p><h3>Annulment Action</h3><p>An annulment action can be filed against administrative acts deemed unlawful. The filing deadline is generally 60 days from the notification of the act.</p><h3>Full Remedy Action</h3><p>A full remedy action can be filed to compensate for damages caused by administrative acts or actions. This action can be filed together with or separately from the annulment action.</p>",
      excerptTr: "İdari yargılama sürecinde iptal davası ve tam yargı davası haklarınız hakkında bilgilendirme.",
      excerptEn: "Information about your rights for annulment and full remedy actions in administrative litigation.",
      categorySlug: "idare-hukuku",
      publishedAt: new Date("2025-10-05"),
    },
    {
      slug: "gayrimenkul-alim-satiminda-hukuki-surecler",
      titleTr: "Gayrimenkul Alım Satımında Hukuki Süreçler",
      titleEn: "Legal Processes in Real Estate Transactions",
      contentTr: "<h2>Gayrimenkul Alım Satımında Hukuki Süreçler</h2><p>Gayrimenkul alım satımı, dikkatli bir hukuki inceleme gerektiren önemli bir işlemdir. Bu rehberde, sürecin her aşamasını ele alacağız.</p><h3>Tapu Araştırması</h3><p>Gayrimenkul satın almadan önce tapu kaydının detaylı incelenmesi gerekmektedir. Üzerinde ipotek, haciz veya şerh bulunup bulunmadığı kontrol edilmelidir.</p><h3>Sözleşme Hazırlığı</h3><p>Alım satım sözleşmesinde bedel, ödeme planı, teslim tarihi ve cezai şartlar açıkça belirtilmelidir. Sözleşmenin noter huzurunda düzenlenmesi önerilmektedir.</p>",
      contentEn: "<h2>Legal Processes in Real Estate Transactions</h2><p>Real estate transactions are significant operations that require careful legal examination. In this guide, we will cover every stage of the process.</p><h3>Title Deed Research</h3><p>Before purchasing real estate, the title deed record must be examined in detail. It should be checked whether there are any mortgages, liens, or annotations on it.</p><h3>Contract Preparation</h3><p>The purchase price, payment plan, delivery date, and penalty clauses must be clearly stated in the sales contract. It is recommended to have the contract prepared before a notary.</p>",
      excerptTr: "Gayrimenkul alım satım sürecinde dikkat edilmesi gereken hukuki adımlar ve öneriler.",
      excerptEn: "Legal steps and recommendations to consider in the real estate buying and selling process.",
      categorySlug: "gayrimenkul-hukuku",
      publishedAt: new Date("2025-09-15"),
    },
  ];

  for (const post of blogPosts) {
    const catId = catMap[post.categorySlug];
    if (!catId) continue;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        titleTr: post.titleTr,
        titleEn: post.titleEn,
        contentTr: post.contentTr,
        contentEn: post.contentEn,
        excerptTr: post.excerptTr,
        excerptEn: post.excerptEn,
        isPublished: true,
        isFeatured: true,
        publishedAt: post.publishedAt,
        authorId: admin.id,
        categoryId: catId,
        metaTitleTr: `${post.titleTr} | Hukuk Bürosu`,
        metaTitleEn: `${post.titleEn} | Law Firm`,
        metaDescTr: post.excerptTr,
        metaDescEn: post.excerptEn,
      },
    });
  }

  // Create testimonials
  const testimonials = [
    {
      nameTr: "Ahmet Y.",
      nameEn: "Ahmet Y.",
      roleTr: "İş İnsanı",
      roleEn: "Business Person",
      textTr: "Ceza davamda gösterdikleri profesyonel yaklaşım ve titiz çalışma sayesinde en iyi sonucu aldık. Teşekkür ederim.",
      textEn: "Thanks to their professional approach and meticulous work in my criminal case, we got the best result. Thank you.",
      order: 1,
    },
    {
      nameTr: "Fatma K.",
      nameEn: "Fatma K.",
      roleTr: "Öğretmen",
      roleEn: "Teacher",
      textTr: "Boşanma sürecimde beni her adımda bilgilendirdiler ve haklarımı en iyi şekilde korudular.",
      textEn: "They kept me informed every step of the way during my divorce and protected my rights in the best way possible.",
      order: 2,
    },
    {
      nameTr: "Mehmet D.",
      nameEn: "Mehmet D.",
      roleTr: "Mühendis",
      roleEn: "Engineer",
      textTr: "İş hukuku konusundaki uzmanlıkları sayesinde haklarımı eksiksiz aldım. Herkese tavsiye ederim.",
      textEn: "Thanks to their expertise in labor law, I received my rights in full. I recommend them to everyone.",
      order: 3,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { nameTr: t.nameTr } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }

  // Create hero slides
  const heroSlides = [
    {
      taglineTr: "HUKUK BÜROSU",
      taglineEn: "LAW OFFICE",
      titleTr: "Güvenilir Hukuki Çözüm Ortağınız",
      titleEn: "Your Trusted Legal Solution Partner",
      subtitleTr: "Deneyimli avukat kadromuzla, hukuki süreçlerinizde yanınızdayız. Haklarınızı en etkin şekilde korumak için çalışıyoruz.",
      subtitleEn: "With our experienced team of lawyers, we are at your side in your legal processes. We work to protect your rights in the most effective way.",
      ctaTextTr: "Hakkımızda",
      ctaTextEn: "About Us",
      ctaLink: "/hakkimizda",
      secondaryCtaTextTr: "Uzmanlık Alanları",
      secondaryCtaTextEn: "Areas of Expertise",
      secondaryCtaLink: "/uzmanlik-alanlari",
      order: 1,
    },
    {
      taglineTr: "UZMANLIK ALANLARIMIZ",
      taglineEn: "AREAS OF EXPERTISE",
      titleTr: "Her Alanda Profesyonel Hukuki Destek",
      titleEn: "Professional Legal Support in All Areas",
      subtitleTr: "Ceza hukuku, aile hukuku, iş hukuku ve daha birçok alanda uzman avukatlarımızla yanınızdayız.",
      subtitleEn: "We are at your side with our expert lawyers in criminal law, family law, labor law and many other fields.",
      ctaTextTr: "Alanlarımızı İnceleyin",
      ctaTextEn: "Explore Our Fields",
      ctaLink: "/uzmanlik-alanlari",
      order: 2,
    },
    {
      taglineTr: "İLETİŞİM",
      taglineEn: "CONTACT US",
      titleTr: "Hukuki Sorununuzu Birlikte Çözelim",
      titleEn: "Let's Solve Your Legal Problem Together",
      subtitleTr: "İlk görüşme ücretsizdir. Hemen bizimle iletişime geçin ve haklarınızı öğrenin.",
      subtitleEn: "The first consultation is free of charge. Contact us now and find out your rights.",
      ctaTextTr: "Bize Ulaşın",
      ctaTextEn: "Contact us",
      ctaLink: "/iletisim",
      secondaryCtaTextTr: "Bizi Arayın",
      secondaryCtaTextEn: "Call Us",
      secondaryCtaLink: "tel:+902121234567",
      secondaryCtaIsExternal: true,
      order: 3,
    },
  ];

  for (const slide of heroSlides) {
    const existing = await prisma.heroSlide.findFirst({ where: { taglineTr: slide.taglineTr } });
    if (existing) {
      await prisma.heroSlide.update({ where: { id: existing.id }, data: slide });
    } else {
      await prisma.heroSlide.create({ data: slide });
    }
  }

  // Create values
  const values = [
    {
      titleTr: "Dürüstlük",
      titleEn: "Honesty",
      descriptionTr: "Şeffaflık ve dürüstlük, hukuki süreçlerde en önemli değerlerimizdir. Müvekkillerimizle her zaman açık ve net iletişim kurar, sürecin her aşamasında bilgilendirme yaparız. Güven ilişkisi, başarılı bir avukat-müvekkil ilişkisinin temelidir.",
      descriptionEn: "Transparency and honesty are our most important values in legal processes. We always maintain open and clear communication with our clients and provide information at every stage of the process. A relationship of trust is the foundation of a successful attorney-client relationship.",
      icon: "Award",
      order: 1,
    },
    {
      titleTr: "Uzmanlık",
      titleEn: "Expertise",
      descriptionTr: "Hukuk sürekli gelişen bir alan olup, ekibimiz güncel mevzuat ve içtihatları yakından takip eder. Düzenli eğitim ve seminerlerle kendimizi geliştirerek müvekkillerimize en doğru ve güncel hukuki bilgiyle hizmet veriyoruz.",
      descriptionEn: "Law is a constantly evolving field, and our team closely follows current legislation and case law. We improve ourselves through regular training and seminars to provide our clients with the most accurate and up-to-date legal information.",
      icon: "BookOpen",
      order: 2,
    },
    {
      titleTr: "Özveri",
      titleEn: "Dedication",
      descriptionTr: "Her davayı kendi davamız gibi sahiplenir, müvekkillerimizin haklarını en etkin şekilde korumak için var gücümüzle çalışırız. Sonuç odaklı yaklaşımımız ve titiz çalışma anlayışımız ile en iyi sonucu elde etmeyi hedefliyoruz.",
      descriptionEn: "We embrace every case as our own and work with all our strength to protect our clients' rights in the most effective way. With our result-oriented approach and meticulous work ethic, we aim to achieve the best outcome.",
      icon: "Heart",
      order: 3,
    },
  ];

  for (const v of values) {
    const existing = await prisma.value.findFirst({ where: { titleTr: v.titleTr } });
    if (existing) {
      await prisma.value.update({ where: { id: existing.id }, data: v });
    } else {
      await prisma.value.create({ data: v });
    }
  }

  // Create page contents (KVKK and Cookie Policy)
  const kvkkContent = `<h2>1. Veri Sorumlusu</h2>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak belirlenen hukuk büromuz tarafından aşağıda açıklanan amaçlar kapsamında, hukuka ve dürüstlük kurallarına uygun bir şekilde işlenebilecek, kaydedilebilecek, saklanabilecek, sınıflandırılabilecek, güncellenebilecek ve mevzuatın izin verdiği hallerde ve/veya işlendiği amaçla sınırlı olarak üçüncü kişilere açıklanabilecek/aktarılabilecektir.</p>

<h2>2. Kişisel Verilerin İşlenme Amaçları</h2>
<p>Kişisel verileriniz, hukuk büromuz tarafından sunulan hizmetlerden sizleri faydalandırmak için gerekli çalışmalar yapmak amacıyla işlenebilecektir. Bu kapsamda kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
<ul>
<li>Avukatlık ve hukuki danışmanlık hizmetlerinin yürütülmesi</li>
<li>Müvekkil ilişkilerinin yönetimi ve iletişimin sağlanması</li>
<li>Hukuki süreçler kapsamında dava ve icra işlemlerinin takibi</li>
<li>Yasal yükümlülüklerin yerine getirilmesi</li>
<li>Hukuk büromuzun idari ve mali işlerinin yürütülmesi</li>
<li>İnternet sitemiz üzerinden iletişim taleplerinin cevaplanması</li>
<li>Yasal düzenlemelerin gerektirdiği bilgi saklama, raporlama ve bilgilendirme yükümlülüklerinin yerine getirilmesi</li>
</ul>

<h2>3. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri</h2>
<p>Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde işlenmektedir.</p>

<h2>4. Kişisel Verilerin Aktarımı</h2>
<p>Kişisel verileriniz; KVKK'nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde, hukuki süreçlerin takibi amacıyla yargı mercilerine ve ilgili kamu kurumlarına, avukatlık mevzuatı gereği baro ve meslek kuruluşlarına, yasal zorunluluklar çerçevesinde kamu kurum ve kuruluşlarına aktarılabilecektir.</p>

<h2>5. Kişisel Veri Toplamanın Yöntemi</h2>
<p>Kişisel verileriniz, hukuk büromuz tarafından farklı kanallar ve farklı hukuki sebeplere dayanılarak toplanmaktadır.</p>

<h2>6. Kişisel Veri Sahibinin KVKK Kapsamındaki Hakları</h2>
<p>KVKK'nın 11. maddesi uyarınca, kişisel veri sahipleri olarak aşağıdaki haklara sahipsiniz:</p>
<ul>
<li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
<li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
<li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
<li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
<li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
<li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
</ul>

<h2>7. Veri Güvenliği</h2>
<p>Hukuk büromuz, kişisel verilerinizin hukuka aykırı olarak işlenmesini önlemek, kişisel verilerinize hukuka aykırı olarak erişilmesini önlemek ve kişisel verilerinizin muhafazasını sağlamak amacıyla uygun güvenlik düzeyini temin etmeye yönelik gerekli her türlü teknik ve idari tedbirleri almaktadır.</p>

<h2>8. Kişisel Verilerin Saklanma Süresi</h2>
<p>Hukuk büromuz, kişisel verilerinizi ilgili mevzuatta belirtilen veya işleme amacının gerektirdiği süre boyunca saklamaktadır.</p>

<h2>9. Politika Değişiklikleri</h2>
<p>Hukuk büromuz, işbu aydınlatma metnini yasal düzenlemelere ve faaliyetlerimize uygun olarak güncelleme hakkını saklı tutar.</p>

<h2>10. Başvuru Yolları</h2>
<p>KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle büromuza başvurabilirsiniz:</p>
<ul>
<li>Islak imzalı dilekçe ile bizzat veya noter aracılığıyla büromuzun adresine başvuru yapabilirsiniz</li>
<li>Güvenli elektronik imza ile imzalanmış dilekçe ile e-posta adresimize başvurabilirsiniz</li>
<li>Kişisel Verileri Koruma Kurumu tarafından belirlenen diğer yöntemlerle başvurabilirsiniz</li>
</ul>`;

  const kvkkContentEn = `<h2>1. Data Controller</h2>
<p>In accordance with the Law No. 6698 on the Protection of Personal Data ("KVKK"), your personal data may be processed, recorded, stored, classified, updated and disclosed/transferred to third parties within the scope of the purposes explained below by our law firm determined as the data controller.</p>

<h2>2. Purposes of Processing Personal Data</h2>
<p>Your personal data may be processed for the purpose of carrying out the necessary work to benefit you from the services offered by our law firm.</p>

<h2>3. Legal Reasons for Processing Personal Data</h2>
<p>Your personal data is processed within the framework of the personal data processing conditions specified in Articles 5 and 6 of the KVKK.</p>

<h2>4. Transfer of Personal Data</h2>
<p>Your personal data may be transferred to judicial authorities and relevant public institutions for the purpose of following legal processes.</p>

<h2>5. Method of Collecting Personal Data</h2>
<p>Your personal data is collected by our law firm through different channels and based on different legal reasons.</p>

<h2>6. Rights of the Personal Data Owner Under KVKK</h2>
<p>Pursuant to Article 11 of the KVKK, you have the following rights as personal data owners.</p>

<h2>7. Data Security</h2>
<p>Our law firm takes all necessary technical and administrative measures to ensure an appropriate level of security.</p>

<h2>8. Retention Period of Personal Data</h2>
<p>Our law firm retains your personal data for the period specified in the relevant legislation or required by the processing purpose.</p>

<h2>9. Policy Changes</h2>
<p>Our law firm reserves the right to update this clarification text in accordance with legal regulations and our activities.</p>

<h2>10. Application Methods</h2>
<p>You can apply to our office using the following methods to exercise your rights under Article 11 of the KVKK.</p>`;

  const cookieContent = `<h2>1. Çerezler Nedir?</h2>
<p>Çerezler (cookies), internet sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük metin dosyalarıdır. Çerezler, internet sitelerinin daha verimli çalışması, kullanıcı deneyiminin iyileştirilmesi ve site sahiplerine bilgi sağlanması amacıyla yaygın olarak kullanılmaktadır.</p>

<h2>2. Kullanılan Çerez Türleri</h2>
<h3>a) Zorunlu Çerezler</h3>
<p>Bu çerezler, internet sitemizin düzgün bir şekilde çalışması için gereklidir.</p>
<h3>b) Performans ve Analitik Çerezler</h3>
<p>Bu çerezler, ziyaretçilerin internet sitemizi nasıl kullandığını anlamamıza yardımcı olur.</p>
<h3>c) İşlevsellik Çerezleri</h3>
<p>Bu çerezler, internet sitemizin sizin için daha kişiselleştirilmiş bir deneyim sunmasını sağlar.</p>
<h3>d) Hedefleme/Reklam Çerezleri</h3>
<p>Bu çerezler, sizin ilgi alanlarınıza daha uygun reklamlar sunmak için kullanılabilir.</p>

<h2>3. Çerezleri Nasıl Yönetebilirsiniz?</h2>
<p>Çerezleri tarayıcı ayarlarınız üzerinden kontrol edebilir ve yönetebilirsiniz.</p>
<ul>
<li>Google Chrome: Ayarlar > Gizlilik ve Güvenlik > Çerezler</li>
<li>Mozilla Firefox: Seçenekler > Gizlilik ve Güvenlik</li>
<li>Safari: Tercihler > Gizlilik</li>
<li>Microsoft Edge: Ayarlar > Gizlilik, Arama ve Hizmetler</li>
</ul>

<h2>4. Üçüncü Taraf Çerezleri</h2>
<p>İnternet sitemizde, üçüncü taraf hizmet sağlayıcıları tarafından yerleştirilen çerezler de bulunabilir.</p>

<h2>5. Çerezler ve Kişisel Verilerin Korunması</h2>
<p>Çerezler aracılığıyla toplanan kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenmektedir.</p>

<h2>6. Politika Değişiklikleri</h2>
<p>Hukuk büromuz, işbu çerez politikasını herhangi bir zamanda güncelleme hakkını saklı tutar.</p>

<h2>7. İletişim</h2>
<p>Çerez politikamız hakkında sorularınız veya talepleriniz için bizimle iletişim sayfamızdaki bilgiler aracılığıyla iletişime geçebilirsiniz.</p>`;

  const cookieContentEn = `<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files placed on your device through your browser when you visit our website.</p>

<h2>2. Types of Cookies Used</h2>
<h3>a) Essential Cookies</h3>
<p>These cookies are necessary for our website to function properly.</p>
<h3>b) Performance and Analytics Cookies</h3>
<p>These cookies help us understand how visitors use our website.</p>
<h3>c) Functionality Cookies</h3>
<p>These cookies allow our website to provide a more personalized experience for you.</p>
<h3>d) Targeting/Advertising Cookies</h3>
<p>These cookies may be used to serve advertisements more relevant to your interests.</p>

<h2>3. How Can You Manage Cookies?</h2>
<p>You can control and manage cookies through your browser settings.</p>

<h2>4. Third-Party Cookies</h2>
<p>Our website may also contain cookies placed by third-party service providers.</p>

<h2>5. Cookies and Protection of Personal Data</h2>
<p>Your personal data collected through cookies is processed within the scope of the Law No. 6698.</p>

<h2>6. Policy Changes</h2>
<p>Our law firm reserves the right to update this cookie policy at any time.</p>

<h2>7. Contact</h2>
<p>For questions or requests about our cookie policy, you can contact us through the information on our contact page.</p>`;

  // Upsert page contents
  await prisma.pageContent.upsert({
    where: { slug: "kvkk" },
    update: {},
    create: {
      slug: "kvkk",
      titleTr: "KVKK Aydınlatma Metni",
      titleEn: "KVKK Clarification Text",
      contentTr: kvkkContent,
      contentEn: kvkkContentEn,
    },
  });

  await prisma.pageContent.upsert({
    where: { slug: "cerez-politikasi" },
    update: {},
    create: {
      slug: "cerez-politikasi",
      titleTr: "Çerez Politikası",
      titleEn: "Cookie Policy",
      contentTr: cookieContent,
      contentEn: cookieContentEn,
    },
  });

  // Create popup
  const existingPopup = await prisma.popup.findFirst({ where: { titleTr: "Ücretsiz Hukuki Danışmanlık" } });
  if (!existingPopup) {
    await prisma.popup.create({
      data: {
        titleTr: "Ücretsiz Hukuki Danışmanlık",
        titleEn: "Free Legal Consultation",
        messageTr: "İlk görüşmeniz ücretsizdir. Hukuki sorunlarınız için hemen randevu alın ve haklarınızı öğrenin.",
        messageEn: "Your first consultation is free. Make an appointment now for your legal issues and learn about your rights.",
        type: "modal",
        linkUrl: "/iletisim",
        linkTextTr: "Randevu Alın",
        linkTextEn: "Make an Appointment",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        isActive: true,
        order: 1,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
