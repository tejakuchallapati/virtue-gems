import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS_DIR =
  "/Users/teja/.cursor/projects/Users-teja-Desktop-Virtue-Gems/assets";
const OUT_DIR = "/Users/teja/Desktop/Virtue Gems/public/products";
const REVIEWS_DIR = "/Users/teja/Desktop/Virtue Gems/public/reviews";

const SIZE = 900;
const BG = { r: 26, g: 10, b: 46 }; // #1a0a2e brand purple

const SKIP = new Set([
  "Logo-a898d63a-6c30-40f1-b632-b21cf330936c.png",
  "logo_with_txt-ac7937a2-4790-4a29-be25-7d33e30838e5.png",
  "Screenshot_2026-06-09_at_14.24.35-b7a825b8-ad0b-4670-8c81-cbaae878de2f.png",
  "Screenshot_2026-06-09_at_14.27.14-3a96351b-b09a-462c-a63e-bd924cd13893.png",
  "Screenshot_2026-06-09_at_14.41.56-223f106a-faf5-484b-b8a9-1ae1f4c26fe5.png",
  "702611506_955724797072634_1642603949023579569_n-4ec4d6d8-ec23-4fcc-b986-14637c93300f.png",
]);

const REVIEW_ONLY = new Set([
  "687781102_1632843581313015_18830006552283430_n-161809f3-c747-4348-990a-6db6eb2b0398.png",
  "671864769_2058906348172191_7561716054992962529_n-a0c69037-8f54-403b-afba-5d29f457428f.png",
]);

const INSTAGRAM_ONLY = new Set([
  "656641350_787103047426304_1272786878052298433_n-82bcaadd-277e-4f32-9457-754a3c3f2724.png",
]);

const PRODUCT_META = {
  "655910354_18057450245499766_1908577689313199055_n-3fde8300-d161-4e9a-94e1-dc93935f91d3.png":
    {
      name: "Emerald Floral Necklace Set",
      slug: "emerald-floral-necklace-set",
      category: "necklaces",
      description: "Gold-toned necklace and stud earrings with emerald floral motifs.",
      tags: ["bestseller", "new"],
      price: 1899,
    },
  "657529494_26796182259988430_7296422646361297468_n-23c8098c-86c1-46ce-ad4d-81051683e028.png":
    {
      name: "Gold Bow Pendant Necklace",
      slug: "gold-bow-pendant-necklace",
      category: "necklaces",
      description: "Delicate gold bow pendant with crystal heart charm.",
      tags: ["trending"],
      price: 899,
    },
  "659166827_1474404064229916_1827137867828264283_n-5c9683bf-826c-46c4-9900-8be2888ff405.png":
    {
      name: "Rose Quartz Bib Necklace",
      slug: "rose-quartz-bib-necklace",
      category: "necklaces",
      description: "Statement bib necklace with pink stones and pearl drops.",
      tags: ["bestseller"],
      price: 1999,
    },
  "669884784_887813140953539_7288229631652502638_n-e1593b6f-a21e-470e-944e-763934878ece.png":
    {
      name: "Pearl Bloom Pendant Necklace",
      slug: "pearl-bloom-pendant-necklace",
      category: "necklaces",
      description: "Double-strand pearl necklace with green teardrop floral pendant.",
      tags: ["new", "trending"],
      price: 1499,
    },
  "670974157_936297849115592_564025158543210339_n-a92920b8-6536-4b65-9967-a40ad04c79b3.png":
    {
      name: "Emerald Leaf Vine Necklace Set",
      slug: "emerald-leaf-vine-necklace-set",
      category: "necklaces",
      description: "Botanical leaf and flower necklace with matching stud earrings.",
      tags: ["bestseller"],
      price: 1799,
    },
  "671810054_18066648797499766_105565321292338432_n-cf019535-2145-49cf-984f-fdcabf17119e.png":
    {
      name: "Heritage Gold Pendant Set",
      slug: "heritage-gold-pendant-set",
      category: "necklaces",
      description: "Layered gold necklace set with filigree pendant and bead drops.",
      tags: ["bestseller"],
      price: 1699,
    },
  "683222119_18065695199499766_6251225457729913059_n-36f5defd-d1f7-4962-b9d1-9447ac15173a.png":
    {
      name: "Butterfly Leaf Cuff Bracelet",
      slug: "butterfly-leaf-cuff-bracelet",
      category: "bracelets",
      description: "Open cuff bracelet with butterfly and wheat-leaf gold detailing.",
      tags: ["new"],
      price: 799,
    },
  "683331061_18065694530499766_727995332628349115_n-49d1cc13-ba40-4d48-b505-ffafac598289.png":
    {
      name: "Ruby Quintet Strand Necklace",
      slug: "ruby-quintet-strand-necklace",
      category: "necklaces",
      description: "Five-strand crystal necklace with ruby drop centerpiece.",
      tags: ["trending"],
      price: 1299,
    },
  "683626814_18065694521499766_8464672776931329357_n-0a3af789-d7f9-4d31-8e27-a45b0287881b.png":
    {
      name: "Temple Collar Necklace Set",
      slug: "temple-collar-necklace-set",
      category: "necklaces",
      description: "Traditional collar necklace with peach stone drops and matching earrings.",
      tags: ["bestseller", "new"],
      price: 1999,
    },
  "683716765_18065694500499766_8158935027567642084_n-822d156d-2242-4b62-9db4-f481ae1e9db3.png":
    {
      name: "Ruby Halo Charm Necklace",
      slug: "ruby-halo-charm-necklace",
      category: "necklaces",
      description: "Fine chain necklace with five ruby floral halo pendants.",
      tags: ["trending"],
      price: 1199,
    },
  "683928581_18065173022499766_2800981906709936345_n-fb15e11c-fccd-4b88-9cf0-3292c1a4d891.png":
    {
      name: "Pink Kundan Choker",
      slug: "pink-kundan-choker",
      category: "necklaces",
      description: "Three-strand pink bead choker with floral Kundan centerpiece.",
      tags: ["new"],
      price: 999,
    },
  "669852520_18062379236499766_4093265079706630160_n-dc2c77f4-b6ed-466d-9b04-069bed7e53cd.png":
    {
      name: "Sapphire Teardrop Necklace",
      slug: "sapphire-teardrop-necklace",
      category: "necklaces",
      description: "Gold mesh chain with sapphire teardrop and crystal florals.",
      tags: ["bestseller"],
      price: 1599,
    },
  "687715076_18066640775499766_6841969452277927400_n-a0cdc165-19c1-45c2-819a-343378ef6228.png":
    {
      name: "Antique Bridal Temple Set",
      slug: "antique-bridal-temple-set",
      category: "necklaces",
      description: "Complete antique gold bridal set with haram, necklace, and maang tikka.",
      tags: ["bestseller", "trending"],
      price: 2000,
    },
  "655807781_18058676480499766_2568157897046425715_n-d52d2c2e-9193-47e1-b80e-864d76e82658.png":
    {
      name: "Pearl Trio Pendant Necklace",
      slug: "pearl-trio-pendant-necklace",
      category: "necklaces",
      description: "Elegant double-strand pearl necklace with ornate gold pendant.",
      tags: ["new"],
      price: 1399,
    },
  "656042171_18059966540499766_6797225341874949313_n-30767f0f-fc58-4904-a483-a241fe934eb2.png":
    {
      name: "Crystal Bow Necklace Collection",
      slug: "crystal-bow-necklace-collection",
      category: "necklaces",
      description: "Delicate gold bow necklaces with crystal and heart charms.",
      tags: ["trending"],
      price: 1099,
    },
  "656895152_18058055939499766_1138594839768212205_n-63493b45-f82f-4e1b-af77-fa284d95da91.png":
    {
      name: "Floral Bow Chain Necklace",
      slug: "floral-bow-chain-necklace",
      category: "necklaces",
      description: "Gold bow pendant necklace styled with fresh floral accents.",
      tags: ["new"],
      price: 949,
    },
  "659243547_18061161149499766_4009692709433318672_n-4cbfa3bd-d52e-4bad-8d53-ee89433705ef.png":
    {
      name: "Ruby Floral Choker Set",
      slug: "ruby-floral-choker-set",
      category: "necklaces",
      description: "Traditional floral choker with ruby accents and matching earrings.",
      tags: ["bestseller"],
      price: 1749,
    },
  "660470784_955463673550750_7746240475185401553_n-837d293b-b254-4363-a8ab-5f03097fa407.png":
    {
      name: "Gold Filigree Layered Necklace",
      slug: "gold-filigree-layered-necklace",
      category: "necklaces",
      description: "Layered gold necklace with intricate filigree pendant.",
      tags: ["trending"],
      price: 1549,
    },
  "669995168_18062695163499766_7241272247338700474_n-37d69a88-7e3e-4e29-8f29-0ed3c9379786.png":
    {
      name: "Pearl Cascade Long Necklace",
      slug: "pearl-cascade-long-necklace",
      category: "necklaces",
      description: "Long pearl strand necklace with gold floral spacer beads.",
      tags: ["new"],
      price: 1249,
    },
  "670242935_18062534723499766_5669524274323934946_n-b6d3508a-8b70-4004-898f-b16150eeff62.png":
    {
      name: "Crystal Starburst Pendant",
      slug: "crystal-starburst-pendant",
      category: "pendants",
      description: "Gold starburst pendant with crystal halo on fine chain.",
      tags: ["trending"],
      price: 849,
    },
  "670556228_2013290749593475_4751022337155848087_n-22e666d4-5c2c-4ea5-9bca-403ad44ab07c.png":
    {
      name: "Emerald Drop Pearl Necklace",
      slug: "emerald-drop-pearl-necklace",
      category: "necklaces",
      description: "Pearl strand necklace with emerald and gold drop pendant.",
      tags: ["bestseller"],
      price: 1349,
    },
  "671157573_18063735194499766_3121504286534131786_n-493a97b3-0599-4e12-bb81-a07dc9effc7e.png":
    {
      name: "Gold Coin Layer Necklace",
      slug: "gold-coin-layer-necklace",
      category: "necklaces",
      description: "Multi-layer gold coin necklace with traditional detailing.",
      tags: ["new"],
      price: 1149,
    },
  "673111732_18063734369499766_8562568933046817540_n-8f0860fc-921e-46ec-9906-32956f975f7b.png":
    {
      name: "Ruby Temple Pendant Necklace",
      slug: "ruby-temple-pendant-necklace",
      category: "necklaces",
      description: "Temple-style pendant with ruby center on delicate gold chain.",
      tags: ["trending"],
      price: 1049,
    },
  "654657697_941174635537057_7765431503084539464_n-35adbbfc-91fc-44a1-9bee-4a1af992c8cc.png":
    {
      name: "Pearl Charm Layer Necklace",
      slug: "pearl-charm-layer-necklace",
      category: "necklaces",
      description: "Layered pearl necklace with gold charm accents.",
      tags: ["new"],
      price: 899,
    },
  "654863872_2700545746968297_4443511499376232958_n-4f4b9edc-d9da-408d-99f3-5b4060c76f63.png":
    {
      name: "Crystal Floral Short Necklace",
      slug: "crystal-floral-short-necklace",
      category: "necklaces",
      description: "Short crystal floral necklace perfect for festive wear.",
      tags: ["bestseller"],
      price: 749,
    },
  "655166454_18057095084499766_5058915482006071070_n-1b90f184-6aad-42b4-8b3f-826d9ceebb58.png":
    {
      name: "Gold Heart Charm Necklace",
      slug: "gold-heart-charm-necklace",
      category: "necklaces",
      description: "Minimal gold chain with heart charm and crystal accents.",
      tags: ["trending"],
      price: 649,
    },
  "655951362_18058380485499766_8390895676450342841_n-ae3f5de7-1eac-43c6-b9e1-b0a0f45c6d79.png":
    {
      name: "Pearl Drop Stud Earrings",
      slug: "pearl-drop-stud-earrings",
      category: "earrings",
      description: "Classic pearl drop earrings with gold stud base.",
      tags: ["bestseller"],
      price: 599,
    },
  "661605427_965616869353252_2386996396095281678_n-17646127-345c-4a66-a2bc-b34cecfcd13a.png":
    {
      name: "Ruby Floral Stud Earrings",
      slug: "ruby-floral-stud-earrings",
      category: "earrings",
      description: "Floral stud earrings with ruby center and crystal petals.",
      tags: ["new"],
      price: 699,
    },
  "700657526_1359917675954830_9004664498502293007_n-badc9ec7-232b-4040-bf61-a7450f7b2cf4.png":
    {
      name: "Gold Wave Bangle Bracelet",
      slug: "gold-wave-bangle-bracelet",
      category: "bracelets",
      description: "Sleek gold wave bangle with polished finish.",
      tags: ["trending"],
      price: 849,
    },
};

async function processToCanvas(inputPath, outputPath) {
  const bg = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: BG,
    },
  })
    .png()
    .toBuffer();

  const glow = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 212, g: 175, b: 55, alpha: 0.08 },
    },
  })
    .blur(40)
    .png()
    .toBuffer();

  const resized = await sharp(inputPath)
    .rotate()
    .resize(Math.round(SIZE * 0.86), Math.round(SIZE * 0.86), {
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const top = Math.round((SIZE - meta.height) / 2);
  const left = Math.round((SIZE - meta.width) / 2);

  await sharp(bg)
    .composite([
      { input: glow, blend: "screen" },
      { input: resized, top, left },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);
}

function buildProduct(id, meta, imagePath) {
  const originalPrice = Math.min(meta.price + 300, 2299);
  return {
    id,
    slug: meta.slug,
    name: meta.name,
    description: meta.description,
    longDescription: `${meta.description} Handpicked from the Virtue Gems collection — crafted for everyday elegance and festive occasions. Each piece is quality-checked and beautifully finished for a premium look.`,
    price: meta.price,
    originalPrice,
    images: [imagePath],
    category: meta.category,
    tags: meta.tags,
    specifications: {
      Material: "Gold-plated alloy",
      Finish: "Anti-tarnish polish",
      Style: "Contemporary Indian",
      Care: "Store in dry pouch",
    },
    stock: 8 + (meta.price % 7),
    rating: 4.6 + (meta.price % 4) * 0.1,
    reviewCount: 12 + (meta.price % 30),
    reviews: [],
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  fs.mkdirSync("/Users/teja/Desktop/Virtue Gems/public/instagram", {
    recursive: true,
  });

  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.endsWith(".png") && !SKIP.has(f))
    .sort();

  const products = [];
  const reviewMedia = [];
  const instagramPosts = [];
  let productIndex = 1;

  for (const file of files) {
    const input = path.join(ASSETS_DIR, file);
    const baseName = file.replace(/\.png$/, "");

    if (REVIEW_ONLY.has(file)) {
      const out = path.join(REVIEWS_DIR, `${baseName}.jpg`);
      await processToCanvas(input, out);
      reviewMedia.push({
        id: baseName,
        type: file.includes("671864769") ? "video" : "image",
        poster: `/reviews/${baseName}.jpg`,
        video: file.includes("671864769")
          ? `/reviews/${baseName}.jpg`
          : undefined,
        caption: file.includes("671864769")
          ? "Our Virtue Gems launch moment — wear your virtue, shine with grace ✨"
          : "A heartfelt note from our Virtue Gems family 💜",
        author: file.includes("671864769") ? "Virtue Gems" : "Happy Customer",
      });
      continue;
    }

    if (INSTAGRAM_ONLY.has(file)) {
      const out = path.join(
        "/Users/teja/Desktop/Virtue Gems/public/instagram",
        `${baseName}.jpg`,
      );
      await processToCanvas(input, out);
      instagramPosts.push({
        id: baseName,
        image: `/instagram/${baseName}.jpg`,
        alt: "Virtue Gems pearl collection",
        url: "https://www.instagram.com/virtue_gems/",
      });
      continue;
    }

    const meta = PRODUCT_META[file];
    if (!meta) {
      console.warn("No metadata for", file);
      continue;
    }

    const outName = `vg-${String(productIndex).padStart(3, "0")}.jpg`;
    const out = path.join(OUT_DIR, outName);
    await processToCanvas(input, out);

    products.push(
      buildProduct(`vg-${String(productIndex).padStart(3, "0")}`, meta, `/products/${outName}`),
    );

    if (productIndex <= 6) {
      instagramPosts.push({
        id: `ig-${productIndex}`,
        image: `/products/${outName}`,
        alt: meta.name,
        url: "https://www.instagram.com/virtue_gems/",
      });
    }

    if ([3, 7, 11, 15, 19].includes(productIndex)) {
      const reviewOut = path.join(REVIEWS_DIR, `customer-${productIndex}.jpg`);
      await processToCanvas(input, reviewOut);
      reviewMedia.push({
        id: `customer-${productIndex}`,
        type: "image",
        poster: `/reviews/customer-${productIndex}.jpg`,
        caption: `Absolutely love my ${meta.name}! Quality is stunning.`,
        author: ["Priya S.", "Ananya R.", "Meera K.", "Kavya M.", "Divya P."][
          Math.floor((productIndex - 1) / 4)
        ],
      });
    }

    productIndex++;
  }

  fs.writeFileSync(
    "/Users/teja/Desktop/Virtue Gems/src/data/products.json",
    JSON.stringify(products, null, 2),
  );

  fs.writeFileSync(
    "/Users/teja/Desktop/Virtue Gems/src/data/customer-media.json",
    JSON.stringify(reviewMedia, null, 2),
  );

  fs.writeFileSync(
    "/Users/teja/Desktop/Virtue Gems/src/data/instagram.json",
    JSON.stringify(
      {
        handle: "virtue_gems",
        profileUrl: "https://www.instagram.com/virtue_gems/",
        posts: instagramPosts.slice(0, 6),
      },
      null,
      2,
    ),
  );

  console.log(`Processed ${products.length} products, ${reviewMedia.length} review media items`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
