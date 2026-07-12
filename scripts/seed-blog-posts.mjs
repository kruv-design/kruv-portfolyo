/**
 * İlk 3 blog yazısını (Figma: 4225:3622, 4225:4492, 4225:4627) CMS'e ekler.
 * 1) /tmp/kruv-blog/assets altındaki görselleri Cloudinary'ye yükler (idempotent),
 * 2) blog_posts tablosuna slug üzerinden upsert eder.
 *
 * Çalıştırma: node scripts/seed-blog-posts.mjs
 * Önkoşul: supabase/RUN_ME_blog_posts.sql çalıştırılmış olmalı (blog_posts tablosu).
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSET_DIR = "/tmp/kruv-blog/assets";
const IMAGES = [
  "grid-modular",
  "grid-axial",
  "grid-baseline",
  "grid-column",
  "grid-radial",
  "grid-hierarchical",
  "logo-fonts",
  "premium-color",
  "premium-whitespace",
  "premium-accent",
];

async function uploadImages() {
  const urls = {};
  for (const name of IMAGES) {
    const file = path.join(ASSET_DIR, `${name}.png`);
    if (!existsSync(file)) {
      // Daha önce yüklendiyse mevcut URL'i kullan
      urls[name] =
        `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/kruv-portfolio/blog/${name}.png`;
      console.log(`- ${name}: yerel dosya yok, mevcut Cloudinary URL varsayıldı`);
      continue;
    }
    const res = await cloudinary.uploader.upload(file, {
      folder: "kruv-portfolio/blog",
      public_id: name,
      overwrite: true,
      resource_type: "image",
    });
    urls[name] = res.secure_url;
    console.log(`- ${name}: yüklendi (${Math.round(res.bytes / 1024)} KB)`);
  }
  return urls;
}

function buildPosts(img) {
  return [
    {
      slug: "grid-systems",
      baslik: "Tasarımın Görünmez İskeleti: Grid Sistemleri",
      title: "The Invisible Skeleton of Design: Grid Systems",
      aciklama:
        "İyi bir tasarımın ardındaki en büyük sır, çoğu zaman izleyicinin bilinçli olarak görmediği ama kesinlikle hissettiği düzen duygusudur. Kruv Ajans olarak görsel hiyerarşi kurarken ve hikâyelerimizi anlatırken güvendiğimiz en güçlü araçlardan biri grid (ızgara) sistemleridir.\n\nBir tasarımı “derli toplu”, “profesyonel” ve “akıcı” gösteren şey, kaosun içindeki düzendir; yani grid’ler. İşte tasarım arşivimizden sık kullandığımız temel grid sistemleri:",
      description:
        "The greatest secret behind a good design is often the sense of order that the viewer may not consciously see but certainly feels. At Kruv Agency, one of the most powerful tools we rely on when creating visual hierarchy and telling our stories is the use of Grid Systems.\n\nWhat makes a design look “composed,” “professional,” and “fluid” is the order within the chaos — that is, grids. Here are some of the fundamental grid systems we frequently use from our design archive:",
      kapak: img["grid-modular"],
      yayinda: true,
      bolumler: [
        {
          baslik: "Tasarım Dilimizi Şekillendiren Grid’ler",
          title: "Grids That Shape Our Design Language",
          metin:
            "Modüler Grid: İçeriği modüllere bölerek hem esneklik hem de sağlam bir yapı sunar. Karmaşık editoryal tasarımlar için mükemmel bir tercihtir.",
          text: "Modular Grid: Divides content into modules, offering both flexibility and a rigid structure. It is a perfect fit for complex editorial designs.",
          gorsel: img["grid-modular"],
        },
        {
          baslik: "",
          title: "",
          metin:
            "Eksenel (Axial) Grid: Tasarıma dinamizm katmak ve öğeleri belirli bir eksen etrafında hizalayarak güçlü bir görsel akış oluşturmak için idealdir.",
          text: "Axial Grid: Ideal for adding dynamism to a design and creating a strong visual flow by aligning elements around a specific axis.",
          gorsel: img["grid-axial"],
        },
        {
          baslik: "",
          title: "",
          metin:
            "Taban Çizgisi (Baseline) Grid: Metnin dikey ritmini sabitleyerek tüm tasarıma kusursuz bir denge ve okunabilirlik kazandırır.",
          text: "Baseline Grid: Adds perfect balance and readability to the entire design by anchoring the vertical rhythm of the text.",
          gorsel: img["grid-baseline"],
        },
        {
          baslik: "",
          title: "",
          metin:
            "Sütun (Column) Grid: Tipografik dengenin ve metin okunabilirliğinin ön planda olduğu projelerimizin vazgeçilmez aracıdır.",
          text: "Column Grid: The essential tool for our projects where typographic balance and text readability are at the forefront.",
          gorsel: img["grid-column"],
        },
        {
          baslik: "",
          title: "",
          metin:
            "Dairesel (Radial) Grid: Merkeze odaklanan dairesel bir akış oluşturmak ve dikkati tasarımın odak noktasına çekmek istediğimizde kullanırız.",
          text: "Radial Grid: Used when we want to create a circular flow focused on the center, drawing attention to the focal point of the design.",
          gorsel: img["grid-radial"],
        },
        {
          baslik: "",
          title: "",
          metin:
            "Hiyerarşik Grid: Okuyucunun gözünü bir yol boyunca yönlendirmek ve en önemli bilgiyi önce sunmak için kullandığımız, hikâye anlatımına en uygun yapıdır.",
          text: "Hierarchical Grid: The most suitable structure for storytelling that we use to guide the reader’s eye along a path and present the most important information first.",
          gorsel: img["grid-hierarchical"],
        },
        {
          baslik: "Grid’leri Neden Kullanıyoruz?",
          title: "Why Do We Use Grids?",
          metin:
            "Grid sistemleri, markaların dijital dünyada (sosyal medya ve web) görsel tutarlılığını korumasına yardımcı olur. Tasarımı rastgele parçalardan oluşan bir kolaj olmaktan çıkarıp izleyicinin zihninde güven ve profesyonellik hissi uyandıran bir yapıya dönüştürürüz.\n\nİster yeni kurulan bir markanın temelini atıyor olalım, ister büyüyen bir markanın görsel dilini güncelliyor olalım; grid’ler, hikâyenizin en net şekilde anlatılmasını sağlayan iskelettir.\n\nGörsel kimliğinizi sağlam temeller üzerine inşa etmek ve daha keşfedilebilir bir marka yaratmak istiyorsanız, Kruv Ajans olarak yanınızdayız. Projelerimize göz atmak ve bizimle iletişime geçmek için kruv.com’u ziyaret edebilirsiniz.",
          text: "Grid systems help brands maintain visual consistency in the digital world (social media and web). We transform a design from a collage of random pieces into a structure that inspires trust and a sense of professionalism in the viewer’s mind.\n\nWhether we are laying the foundation for a newly established brand or updating the visual language of a growing one, grids are the skeleton that allows your story to be told in the most clear way.\n\nIf you want to build your visual identity on solid foundations and create a more discoverable brand, we at Kruv Agency are ready to assist you. You can visit kruv.com to browse our projects and get in touch with us.",
          gorsel: "",
        },
      ],
    },
    {
      slug: "timeless-logo-design",
      baslik: "Zamansız Logo Tasarımı: Tipografinin Gücü",
      title: "Timeless Logo Design: The Power of Typography",
      aciklama:
        "Logo, bir sembolden çok daha fazlasıdır; markanızın dünyasına açılan kapıdır. Kruv Ajans olarak “cool” bir logonun, geçici trendlerin ötesine geçen ve markanın özünü en saf hâliyle yansıtan görsel bir imza olduğuna inanıyoruz. Peki markanızı farklılaştıracak o ikonik tasarımı nasıl yakalıyoruz?",
      description:
        "A logo is much more than just a symbol; it is the gateway to your brand’s world. At Kruv Agency, we believe a “cool” logo is a visual signature that transcends temporary trends and reflects the essence of a brand in its purest form. So, how do we capture that iconic design that will set your brand apart?",
      kapak: img["logo-fonts"],
      yayinda: true,
      bolumler: [
        {
          baslik: "Logo Tasarımında Tipografinin Rolü",
          title: "The Role of Typography in Logo Design",
          metin:
            "Bazı markalar için en ikonik logo, marka adının kendisidir. Özgün bir tipografi seçimi ya da değiştirilmiş harf formları markanıza karakter katar. Tipografi, logonun “ses tonunu” belirler; markanızın ciddi mi, eğlenceli mi yoksa lüks mü olduğunu izleyiciye tek bakışta hissettirir.\n\nTasarım arşivimizden, logonuza “cool” ve iddialı bir duruş kazandıracak favori yazı tipi önerilerimiz:\n\n• Agenova: Güçlü ve sofistike yapısıyla lüks ve modern marka kimlikleri için mükemmel bir seçim.\n\n• Amatry: Modern ve minimalist duruşuyla yenilikçi markaların favorisi olmaya aday.\n\n• Makota: Keskin hatları ve dengeli formlarıyla kurumsal kimliğe zarafet katıyor.\n\n• Marga: Daha eğlenceli ve çarpıcı bir tarz arayanlar için özgün bir seçenek.",
          text: "For some brands, the most iconic logo is the brand name itself. A unique choice of typography or modified letterforms adds character to your brand. Typography defines the “tone of voice” of a logo; it lets the viewer feel at a glance whether your brand is serious, playful, or luxurious.\n\nFrom our design archive, here are some of our favorite font recommendations that will give your logo a “cool” and assertive stance:\n\n• Agenova: An excellent choice for luxury and modern brand identities with its strong and sophisticated structure.\n\n• Amatry: A candidate to be the favorite of innovative brands with its modern and minimalist stance.\n\n• Makota: Adds elegance to corporate identity with its sharp lines and balanced forms.\n\n• Marga: A unique option for those looking for a more playful and striking style.",
          gorsel: img["logo-fonts"],
        },
        {
          baslik: "“Cool” Bir Logo İçin Stratejik İpuçları",
          title: "Strategic Tips for a “Cool” Logo",
          metin:
            "Sadeliğin Gücü (Minimalizm): En akılda kalıcı logolar, en az karmaşaya sahip olanlardır. Gereksiz detaylardan arındırılmış, tek bakışta algılanabilen ve her mecrada kusursuz çalışan logolar “zamansızdır”.\n\nHikâye Anlatan Sembolizm: “Cool” bir logo, markanızın hikâyesini gizli bir dille anlatır. Kruv Ajans olarak tipografik oyunlarla markanın karakterini yansıtan semboller inşa ediyoruz.\n\nUygulanabilirlik ve Ölçeklenebilirlik: İyi bir logo, çok küçük bir uygulama alanında da dev bir dijital ekranda da aynı gücü korumalıdır.\n\nLogo, markanızın dünyaya bıraktığı ilk izlenimdir. Görsel kimliğinizi bir üst seviyeye taşımak ve markanıza özel zamansız bir logo tasarlamak isterseniz projelerimize göz atabilir ya da bizimle iletişime geçmek için kruv.com’u ziyaret edebilirsiniz.",
          text: "The Power of Simplicity (Minimalism): The most memorable logos are those with the least clutter. Logos that are stripped of unnecessary details, perceptible at a single glance, and work perfectly on any platform are “timeless”.\n\nSymbolism That Tells a Story: A “cool” logo tells your brand’s story in a secret language. At Kruv Agency, we build symbols that reflect the character of the brand using typographic games.\n\nApplicability and Scalability: A great logo must maintain the same power both in a very small application area and on a very large digital screen.\n\nA logo is the first impression your brand leaves in the world. If you would like to take your visual identity to the next level and design a timeless logo specific to your brand, you can browse our projects or visit kruv.com to get in touch with us.",
          gorsel: "",
        },
      ],
    },
    {
      slug: "premium-design-feel",
      baslik: "Tasarımınıza “Premium” His Katmanın 3 Yolu",
      title: "3 Ways to Elevate Your Design to a “Premium” Feel",
      aciklama:
        "İyi tasarım yalnızca estetik görünmez; izleyicide belirli bir his uyandırır. Kruv Ajans olarak görsel kaliteyi “premium” seviyeye taşımak için kullandığımız temel prensipleri tasarım arşivimizden bu seride derledik.\n\nBir tasarımın “pahalı”, “kaliteli” ve “profesyonel” hissettirmesi tesadüf değildir. İşte o görünmez dokunuşlar:",
      description:
        "Good design doesn’t just look aesthetic; it evokes a specific feeling in the audience. At Kruv Agency, we have compiled the core principles we use to elevate visual quality to a “premium” level into this series from our design archive.\n\nIt is no coincidence that a design feels “expensive,” “high-quality,” and “professional.” Here are those invisible touches:",
      kapak: img["premium-color"],
      yayinda: true,
      bolumler: [
        {
          baslik: "1. Renk Paletini Düzenleyin",
          title: "1. Edit the Color Palette",
          metin:
            "Tasarımınızda renkleri rastgele kullanmak görsel hiyerarşiyi zayıflatır.\n\n• Çok fazla renk: Görsel karmaşaya ve zayıf bir hiyerarşiye yol açar.\n\n• 3 Renk Kuralı: Paletinizi sınırlı tutmak net bir hiyerarşi oluşturur; izleyicinin gözünü yormadan yönlendirmenizi sağlar.",
          text: "Using colors randomly in your design weakens visual hierarchy.\n\n• Too many colors: Leads to visual clutter and a weak hierarchy.\n\n• The 3-Color Rule: Keeping your palette limited creates a clear hierarchy and allows you to guide the viewer’s eye without tiring them.",
          gorsel: img["premium-color"],
        },
        {
          baslik: "2. Boşluk, Rengi Desteklesin",
          title: "2. Let Whitespace Support Color",
          metin:
            "Boşluk, tasarımın en değerli öğelerinden biridir.\n\n• Az boşluk: Öğeleri sıkıştırmak algıyı zorlaştırır ve “aşırı yüklenme” hissi yaratır.\n\n• Ferah tasarım: Boşluk, renklerinizin ve içeriğinizin “nefes almasını” sağlar. Renklerinizin etkisini artırır ve tasarımı daha prestijli gösterir.",
          text: "Space is one of the most valuable elements of design.\n\n• Little space: Crowding elements makes perception difficult and creates a feeling of “overload”.\n\n• Spacious Design: Whitespace allows your colors and content to “breathe”. It enhances the impact of your colors and makes the design appear more prestigious.",
          gorsel: img["premium-whitespace"],
        },
        {
          baslik: "3. Vurgu Renklerini Ölçülü Kullanın",
          title: "3. Use Accent Colors Sparingly",
          metin:
            "Bir vurgu rengi her yerde kullanıldığında “vurgu” olmaktan çıkar.\n\n• Her yerde: Vurgu rengi tasarımın her noktasındaysa odağını kaybeder ve “görünmez” hâle gelir.\n\n• Ölçülü kullanım: Vurgu renklerini yalnızca harekete geçirici mesajlar (CTA) veya çok özel detaylar için kullandığınızda, izleyicinin zihninde akılda kalıcı ve etkili bir iz bırakırsınız.",
          text: "When an accent color is used everywhere, it ceases to be an “accent”.\n\n• Everywhere: If the accent color is at every point of the design, it loses its focus and becomes “invisible”.\n\n• Measured use: When you use accent colors only for calls to action (CTA) or very special details, you leave a memorable and impactful impression on the viewer’s mind.",
          gorsel: img["premium-accent"],
        },
        {
          baslik: "Markanızın Görsel Dili “Premium” mu?",
          title: "Is Your Brand’s Visual Language “Premium”?",
          metin:
            "Tasarım bir bütündür. İzleyicinin zihnindeki değer algısı, küçük detayların birleşimiyle şekillenir. Markanızın görsel kimliğini daha profesyonel, akıcı ve etkileyici bir seviyeye taşımak istiyorsanız, Kruv Ajans olarak yanınızdayız.",
          text: "Design is a whole. The value perception in the viewer’s mind is shaped by the combination of small details. If you want to take your brand’s visual identity to a more professional, fluid, and impressive level, we at Kruv Agency are ready to assist you.",
          gorsel: "",
        },
      ],
    },
  ];
}

async function upsertPosts(posts) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_posts?on_conflict=slug`,
    {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(posts),
    },
  );
  const body = await res.text();
  if (!res.ok) {
    console.error(`HATA — Supabase ${res.status}:`, body.slice(0, 300));
    if (res.status === 404) {
      console.error(
        "\nblog_posts tablosu yok. Önce Supabase SQL Editor'da supabase/RUN_ME_blog_posts.sql dosyasını çalıştırın, sonra bu scripti tekrar çalıştırın.",
      );
    }
    process.exit(1);
  }
  const rows = JSON.parse(body);
  console.log(`\n${rows.length} yazı eklendi/güncellendi:`);
  for (const r of rows) console.log(`- ${r.slug} (${r.baslik})`);
}

const urls = await uploadImages();
await upsertPosts(buildPosts(urls));
