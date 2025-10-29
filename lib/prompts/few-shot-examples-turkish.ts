/**
 * Turkish high-quality few-shot examples for viral thread generation
 * Türkçe viral thread örnekleri
 */

export const fewShotExamplesTurkish = `
ÖRNEK 1 - Kırılganlık/Yolculuk Tarzı:
GIRDI: draft="SaaS kurdum, başarısız launch", refinePrompt="samimi hikaye", style="narrative", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "6 ay gizli SaaS geliştirdim. Launch günü: 2 kayıt, ikisi de arkadaşlarım test için. $0 gelir. Bırakmak istedim. İşte muhteşem başarısızlığımdan öğrendiklerim (ve 3 ay sonra $5K MRR'a nasıl ulaştım): 🧵",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Hata #1: İzole geliştirme. Sıfır pazar doğrulaması. Deveların 'daha iyi proje yönetimi' istediğini varsaydım. Meğer istemiyorlarmış. Müşteri görüşmesine $0, kimsenin istemediği özelliklere $12K harcadım.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Pivot: Her gün başarısızlıklarımı tweetlemeye başladım. Geliri ($0), bugları, tasarım felaketlerini paylaştım. İnsanlar 'X özelliği için para verirdim' diye yanıtlamaya başladı. Roadmap yerine onu yaptım.",
      "emojis": ["💡"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "30 gün içinde: Twitter'dan 47 kayıt. $890 MRR. Sır? Özellik satmayı bıraktım, açıkta problem çözmeye başladım. Her tweet gizlenmiş müşteri görüşmesiydi.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "90 gün sonra: $5.2K MRR, 230 müşteri, 4K takipçi. Tamamen organik. İroni? 'Başarısız' ürünümün UX'i daha iyiydi. Ama kimse umursamadı çünkü kullanıcılarla hiç konuşmamıştım.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Ders: En büyük rakibin başka bir ürün değil—kimsenin istemediği bir şey yapmak. Çirkin ship et, kullanıcılarla konuş, açıkta iterate et. Şu an solo yapıyorsan, ne üzerinde çalıştığını yanıtla. Dürüst feedback vereyim.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "10K-50K (kırılganlık + metrikler + dönüşüm hikayesi)",
  "publishTips": "Salı/Çarşamba 09-11 arası paylaş. $0 gelir dashboard screenshot'u ekle. Thread'i pinle."
}

ÖRNEK 2 - Karşıt/Veri Odaklı Tarz:
GIRDI: draft="Cold email artık çalışmıyor", refinePrompt="tartışmalı görüş veriyle", style="contrarian", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Herkes cold email öldü diyor. Geçen çeyrekte 10.000 cold email attım. 847 yanıt, 34 demo, 12 müşteri, $47K gelir. Cold email ölmedi—senin yaklaşımın öldü. İşte veriler:",
      "emojis": ["🎯"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Problem: 2015 playbook'larını takip ediyorsun. 'Merhaba {isim}, {şirket}'i fark ettim...' %0.3 yanıt alıyor. 16 farklı açılış test ettim. Kazanan? Acımasız dürüstlük. 'Bu bir cold email. Neden rahatsız ediyorum:'",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Template %8.4 yanıt aldı: 'Konu: [gerçek problem] hakkında soru. Gövde: Ben [ürün] satıyorum. Muhtemelen umursamıyorsun. Ama [spesifik acı] yaşıyorsan, [rakip] için %60 azalttık. 30sn demo?' Bu kadar.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Neden işliyor: Sahte kişiselleştirme yok. 'Şirketinizi seviyorum' saçmalığı yok. Sadece değer + kanıt + düşük sürtünme. İnsanların saçmalık dedektörü maksimumda. Dürüstlük dikkat çekiyor.",
      "emojis": ["⚡"],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "90 günlük sonuçlar: 10K email, 847 yanıt (%8.4), 142 ilgili, 34 demo, 12 anlaşma ($47K toplam). Hepsi B2B SaaS. Ortalama: $3.9K/yıl. Maliyet: $84 (email tool + VA). ROI: 560x.",
      "emojis": ["📊"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Meta-ders: Her pazarlama kanalı medyokrite ile dolunca 'ölür'. Çözüm yeni kanal değil—eskisinde 10x daha iyi olmak. Tam template breakdown ister misin? 'template' yanıtla, DM'den göndereyim.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "15K-75K (tartışmalı + spesifik veri + uygulanabilir)",
  "publishTips": "Pazartesi 7-9 arası B2B erişimi için. Yanıt oranı bar chart'ı ekle. İlk saatte her yanıta cevap ver."
}

ÖRNEK 3 - Taktiksel Liste Tarzı:
GIRDI: draft="Gerçekten işleyen büyüme taktikleri", refinePrompt="uygulanabilir ipuçları", style="listicle", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "SaaS'ım için 47 büyüme taktiği test ettim. 43'ü başarısız oldu. Bu 4'ü gerçekten işledi ve $0 maliyeti. Tam playbook'larla thread:",
      "emojis": ["🔥"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "1/ SEO programmatic sayfalar: 200 '[tool] vs [rakip]' karşılaştırma sayfası oluşturdum. 6 haftada 84 terim için #1-3'e çıktım. Trafik: 0→3.2K/ay. Kayıt: 127. Kullanılan: Next.js + markdown. Süre: toplamda 8 saat.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "2/ Başarısız startup mezarlığı: Önceki başarısız ürünlerimi /graveyard sayfasında acımasız dürüst postmortem'larla listeledim. HN'de #2 oldu. 12K ziyaretçi, 48 saatte 340 kayıt. İnsanlar kırılganlık + dersler seviyor.",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "3/ Rakip yorum kaçırma: F5Bot ile Reddit'te rakip mention'larını takip ettim. 'Hiç [ürünümü] denedin mi? X'i Y yaparak daha iyi çözüyoruz' diye yanıt verdim. Sadece bundan ayda 23 kayıt. Günde 15dk alıyor.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "4/ Haftalık 'build in public' metrik thread'i: Her Pazartesi, gelir, churn, feature ilerlemesi paylaştım. Format: 'Hafta 23: $4.2K MRR (+%12), 3 churn (-$180), X ship edildi.' 4 ayda 200→4K takipçi. Bu thread'lerden gelen kayıt: 89.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Toplam sonuç: $0 harcama, 579 kayıt, bu 4 taktikten $8.4K MRR. Ortak patern? Hepsi samimi, satış yapmıyor. Her biri için kullandığım template'leri + toolları istersen, yanıt at tam playbook'u göndereyim.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "8K-35K (taktiksel + spesifik sayılar + template'ler)",
  "publishTips": "Pazar akşamı 18-20 arası (haftalarını planlıyorlar). Her taktiği numaralandır. Sorulara yoğun yanıt ver."
}

ÖRNEK 4 - Vaka Çalışması Tarzı:
GIRDI: draft="İlk 1000 kullanıcıyı nasıl aldık", refinePrompt="detaylı breakdown", style="data-driven", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "60 günde 0'dan 1.000 kullanıcıya. $0 reklam. İşte kullandığımız tam 3-kanallı playbook (her aşamada conversion verileriyle):",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Kanal 1: ProductHunt launch. Hazırlık: 30 gün teaser tweet, 40 'beta tester' sıcak intro, launch video. Sonuç: Günün #2 ürünü, 4.2K ziyaretçi, 312 kayıt (%7.4 conv), 89 aktif (%28.5). Çıkarım: Pre-launch > launch günü.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Kanal 2: İçerik SEO. Strateji: '[iş] için [pahalı tool] olmadan nasıl' formatı. 12 makale, ort 1.200 kelime. Ay 1: 40 ziyaretçi. Ay 2: 890 ziyaretçi, 67 kayıt (%7.5 conv). Compounding etki gerçek ama yavaş.",
      "emojis": ["📝"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Kanal 3: Twitter DM (spam değil). Çözdüğümüz problemden tweet atan 200 kişi buldum. Açıkta değer verdim, sonra DM: 'Tam bu problem için tool yaptım, erken erişim ister misin?' %43 açtı, %18 kayıt oldu. Buradan 156 kullanıcı.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "Conversion hunisi: 1.000 kullanıcı → 340 aktif (%34) → 89 ücretli deneme (%26) → 34 convert (%38) = $2.1K MRR. En büyük düşüş: aktivasyon (%66 setup'ı bitirmedi). Onboarding checklist ile düzelttik, şimdi %51 aktivasyon.",
      "emojis": ["📊"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Önemli içgörü: Taktiklere takıntılıydık, aktivasyonu görmezden geldik. Kullanıcı almak kolay. Onları değere ulaştırmak zor. 1K öncesiysen, en büyük büyüme zorlunu yanıtla. Benzer durumlar için ne işe yaradıysa paylaşayım.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "12K-45K (detaylı veri + playbook + vaka çalışması)",
  "publishTips": "Salı 10:00'da paylaş. Basit funnel görseli oluştur. Soru soranlara detaylı yanıt ver."
}

ÖRNEK 5 - Tek Viral Post:
GIRDI: draft="Verimlilik hack'i", refinePrompt="hızlı kazanım", style="inspirational", mode="single"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Yanlış feature'lara 6 ay harcadım. Sonra bu 5dk'lık günlük alışkanlığa başladım: Her sabah 'Bugün X üzerinde çalışıyorum çünkü müşteri Y, Z dedi' diye tweet atıyorum. Her görevi gerçek kullanıcı ihtiyacına bağlamaya zorluyor. 3x hızlı ship ettim, sıfır boşa kod. Yarın dene.",
      "emojis": ["⚡"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "5K-20K (hızlı uygulanabilir içgörü + kişisel kanıt)",
  "publishTips": "Sabah 6-7 arası paylaş (sabah scroll). Kısa tut. İlgi görürse 24 saat pinle."
}

ÖRNEK 6 - Kurucu Yolculuğu:
GIRDI: draft="İşten ayrılıp startup kurdum", refinePrompt="duygusal hikaye", style="narrative", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Google'da $140K/yıl maaş. SaaS kurmak için bıraktım. 9 ay sonra: $2.3K MRR, bankada $847, her şeyi sorguluyorum. Full-time indie olmak hakkında anlatılmayan gerçekler:",
      "emojis": ["😰"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "Ay 1-3: Balayı dönemi. Sabah 5'te enerjik uyanıyorum. Feature ship ediyorum. Dahi gibi hissediyorum. $0 gelir ama 'daha erken.' Birikim: $32K kaldı. Özgüven: 11/10.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "Ay 4-6: Gerçeklik vurdu. İlk ücretli müşteri ($29/ay) piyango kazanmak gibi. Sonra churn oldu. Kendi problemimi çözdüğümü, onlarınkini değil fark ettim. Core feature'ı 3x rebuild ettim. Birikim: $18K. Özgüven: 4/10. Uyku: yok.",
      "emojis": ["💀"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Ay 7: Kırılma noktası. $847 MRR, kira günü, 'gerçek iş' düşünüyorum. Eşim gece 2'de laptop başında ağlarken buldu. Dedi ki: 'Yarın kullanıcıların para vereceği en küçük şey ne?' Her şeyi değiştirdi.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "'Havalı feature'lar yapmayı bıraktım. Acil problemleri çözmeye başladım. Basit CSV export feature'ı 4 saatte yaptım. İlk haftada 6 müşteri $49 ödedi. Ders: Desperete ihtiyaçlar > güzel olurdu'lar.",
      "emojis": ["💡"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Ay 9: $2.3K MRR. Hayatta kalmaya yetmiyor ama mümkün olduğunu gösteriyor. Banka hesabı her gün korkutuyor. Ama artık gerçek problemler çözüyorum. Startup'ının karmaşık ortasındaysan, yalnız değilsin. Anlayan biriyle konuşman gerekirse DM at.",
      "emojis": ["🫂"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "20K-100K (aşırı kırılganlık + ilişkilendirilebilir mücadele + ham duygu)",
  "publishTips": "Çarşamba 19:00'da paylaş (akşam scroll, duygusal bağ). Kırılgan olduğunda paylaş. Bu tip samimiyetle viral olur."
}

ÖRNEK 7 - Hızlı Taktiksel Kazanım:
GIRDI: draft="Landing page conversion ipucu", refinePrompt="spesifik taktik", style="data-driven", mode="single"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Landing page başlığını 'En iyi proje yönetim aracı'ndan 'Toplantısız 3x hızlı proje ship et'e değiştirdim. Conversion: %2.1 → %8.7. Spesifiklik > genel iddialar. Başlığın cevaplamalı: daha hızlı/ucuz/kolay + [acı] olmadan. Bu hafta test et.",
      "emojis": ["📈"],
      "isCta": true
    }
  ],
  "estimatedImpressions": "3K-15K (spesifik veri + uygulanabilir formül)",
  "publishTips": "Öğle 12-13 arası paylaş (öğle molası). Mümkünse öncesi/sonrası screenshot ekle."
}

ÖRNEK 8 - Tartışmalı Görüş:
GIRDI: draft="VC fonlaması tuzak", refinePrompt="güçlü görüş", style="contrarian", mode="thread"
ÇIKTI:
{
  "thread": [
    {
      "tweetNumber": 1,
      "text": "Popüler olmayan görüş: VC fonlaması ilk startup'ımı yok etti, ikincisini kurtardı. Fark para değildi—hazır olup olmamamdı. Fon almalı mısın nasıl anlaşılır (çoğu kurucu bunu yanlış yapıyor):",
      "emojis": ["⚠️"],
      "isCta": false
    },
    {
      "tweetNumber": 2,
      "text": "İlk startup: $0 MRR'da $2M seed aldım. 'Fikir hot'tu. 1. ayda 8 kişi işe aldım. Lüks ofis, langırt, catering. Ayda $140K yaktık. 18 ay sonra: $0 gelirle kapandı. Param vardı, pazarım yoktu.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 3,
      "text": "İkinci startup: Önce $40K MRR'a bootstrap ettim. $5M Series A aldım. Satış ekibi + altyapıya kullandım, 'product-market fit bulmaya' değil. 24 ay sonra: $2.4M ARR, kârlı. Pazarım vardı, scale için paraya ihtiyacım vardı.",
      "emojis": ["📈"],
      "isCta": false
    },
    {
      "tweetNumber": 4,
      "text": "Test: Net şekilde söyleyebiliyor musun (1) kimin para verdiğini, (2) hangi spesifik acıyı çözdüğünü, (3) alternatiflere göre neden 10x daha iyisin, (4) birim ekonomilerini? Hepsine evet ise, al. Herhangi birine hayır ise, daha uzun bootstrap et.",
      "emojis": [],
      "isCta": false
    },
    {
      "tweetNumber": 5,
      "text": "VC parası kötü değil. Roket yakıtı. Ama roket yakıtı sadece roketin varsa işe yarıyor. Yoksa, sadece pahalı bir patlama. Çoğu kurucu 'paraya ihtiyacım var'ı 'işimi anlamam lazım' ile karıştırıyor.",
      "emojis": ["🚀"],
      "isCta": false
    },
    {
      "tweetNumber": 6,
      "text": "Fon almayı düşünüyorsan, nerede olduğunu yanıtla. Hazır mısın yoksa daha uzun bootstrap etmeli misin dürüstçe söylerim. Saçmalık yok, sadece $2M hatasından pattern-matching.",
      "emojis": [],
      "isCta": true
    }
  ],
  "estimatedImpressions": "25K-120K (tartışmalı + kişisel başarısızlık + framework)",
  "publishTips": "Pazartesi sabah 8'de paylaş (hafta başı, yüksek engagement). Yanıtlarda tartışma bekle—hem destekçilerle hem eleştirmenlerle samimi engage ol."
}
`;
