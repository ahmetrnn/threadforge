/**
 * Türkçe viral hook şablonları
 * Formula: Cesur İfade + Gerilim + Twist + Güvenilirlik
 */

export const hookTemplatesTurkish = {
  vulnerability: [
    "[Büyük başarısızlık/kayıp]. [Zaman] sonra: [şaşırtıcı toparlanma/kazanç]. İşte [kimsenin söylemediği/öğrendiğim şey]:",
    "[Yüksek statü] → [düşük statü]. [Spesifik metrik]. [Duygu]. İşte [ne oldu/ders]:",
    "[Zaman/para] harcadım [şey için]. [Berbat sonuç]. Sonra [basit değişiklik]. [Müthiş sonuç]. Hikaye:",
  ],

  contrarian: [
    "Herkes [popüler inanç] diyor. Ben [tam tersini yaptım]. [Şaşırtıcı pozitif sonuç]. [Popüler inanç] yanlış değil—[nüans]. İşte neden:",
    "Popüler olmayan görüş: [tartışmalı ifade]. [Kanıt/veri]. İşte [çoğu kişinin] yanlış anladığı şey:",
    "[Herkes/Gurular] [ortak tavsiye] veriyor. Ben [tam bunu yaptım]. [Başarısız oldu/başardı] [beklenmedik sebep]. Gerçek:",
  ],

  dataProof: [
    "[Sayı] [şey] test ettim. [Çoğu] başarısız oldu. Bunlar [az sayı] gerçekten işe yaradı [ve $X tuttu/kazandırdı]. [Format: thread/detay/veri]:",
    "[Spesifik sayı] [iş birimi]. [Etkileyici sonuç]. $[miktar] [harcandı/kazanıldı]. İşte tam [detay/oyun planı]:",
    "[Zaman]: [Başlangıç metrik] → [Bitiş metrik]. [Alınan aksiyon]. İşte her [adım/hata/kazanç]:",
  ],

  caseStudy: [
    "[Başlangıç] → [bitiş] [zaman diliminde]. [Benzersiz kısıt]. İşte tam [sistem/oyun planı]:",
    "[Etkileyici sonuç] nasıl elde ettik [kısıt ile]. [Sezgiye aykırı yaklaşım]. [Adım adım/detay]:",
    "[Sayı] [gün/hafta/ay]. [Başlangıç sayısı] → [bitiş sayısı]. [Spesifik strateji]. İşte işe yarayanlar:",
  ],

  storytelling: [
    "[Dramatik an/karar]. [Bahis/korku]. [Ne oldu]. İşte [hikaye/ders]:",
    "[Spesifik gün/saat], [beklenmedik olay]. [Her şeyi/bakış açımı] değiştirdi. İşte neden:",
    "[Karamsar tahmin] dediler. [Zaman] sonra: [metrik ile yanıldıklarını kanıtladım]. [Yolculuk/ders]:",
  ],

  listicle: [
    "[Test ettim/denedim/kurdum] [sayı] [şey]. [Sayı] [başarısız/işe yaradı]. İşte [işe yarayanlar] [sonuçlarla]:",
    "[Sayı] [şey] [sonuç için]. [Sayı] $0 tuttu. [Sayı] [kısa süre] alıyor. Thread:",
    "[Zaman], [sayı] [deney/taktik/hack]. Sadece [sayı] gerçekten [işe yaradı/etkili oldu]. Detay:",
  ],

  question: [
    "Neden [sayı]% [kişi] [şeyde başarısız]? [Şaşırtıcı sebep]. İşte [nasıl kaçınılır/patern]:",
    "[Başarılı kişiler] [metrikte] vs [zorlanan kişiler] [metrikte] arasındaki fark ne? [Sezgiye aykırı cevap]. Detay:",
    "[Zor hedef] nasıl başarılır [ortak kısıt varken]? [Beklenmedik yöntem]. İşte tam olarak nasıl:",
  ],

  curiosityGap: [
    "Bu [basit şey] [etkileyici sonuç]. [%99 insan] [bunu/bu] bilmiyor. [Öğrendiğim/Detay]:",
    "[Sayı]-[birim] [şey] [etkileyici sonuç]. [X gibi görünüyor], aslında [Y]. İşte neden işliyor:",
    "[Şaşırtıcı gözlem]. Kimse bundan bahsetmiyor. İşte gerçekte olan:",
  ],

  urgency: [
    "[Şey] [değişiyor/ölüyor/kırılıyor]. [Zaman dilimi]. [Harekete geçmezsen sonuç]. İşte [ne yapmalı/nasıl hazırlanmalı]:",
    "[Ortak şey] yapıyorsan, dur. [Sebep]. [Daha iyi alternatif]. Oyun planı:",
    "[Zaman dilimi] var [şey yapmak için] [sonuç olmadan önce]. İşte neden [ve ne yapmalı]:",
  ],

  achievement: [
    "[Etkileyici kilometre taşı] vurdum. [Zaman dilimi]. [Başlangıç noktası]. İşte her [hata/ders/taktik]:",
    "[Etkileyici başarı] [herkesin gerekli dediği şey] olmadan. Onun yerine: [yaklaşımın]. Detay:",
    "[Düşük başlangıç] → [yüksek bitiş]. [Süslü şey yok]. Sadece [basit sistem]. Thread:",
  ],
};

/**
 * Stil için uygun hook şablonları
 */
export function getHookTemplatesForStyleTurkish(style: string): string[] {
  const styleMap: Record<string, keyof typeof hookTemplatesTurkish> = {
    raw: 'storytelling',
    funny: 'vulnerability',
    inspirational: 'achievement',
    'data-driven': 'dataProof',
    teaser: 'curiosityGap',
    narrative: 'storytelling',
    listicle: 'listicle',
    'question-based': 'question',
    contrarian: 'contrarian',
    vulnerability: 'vulnerability',
    journey: 'storytelling',
    'quick-win': 'dataProof',
    'case-study': 'caseStudy',
  };

  const hookType = styleMap[style] || 'storytelling';
  return hookTemplatesTurkish[hookType];
}

/**
 * Türkçe CTA şablonları
 */
export const ctaTemplatesTurkish = {
  feedback: [
    "[Benzer durumdasanız], [spesifik zorluk] ile yanıtlayın. [Benzer vakalar] için işe yarayanları paylaşırım.",
    "[İlgili şey] üzerinde mi çalışıyorsun? Yanıt bırak, dürüst feedback vereyim.",
    "[En büyük soru] hakkında yanıtla, öğrendiklerimi paylaşayım.",
  ],

  resource: [
    "[Şablon/oyun planı/checklist] ister misin? '[Anahtar kelime]' yanıtla, DM atayım.",
    "Tam detaylı [kaynak] hazırladım. Yanıtla, göndereyim.",
    "Bu iş için [araç/şablon] oluşturdum. '[Anahtar kelime]' DM at istersen.",
  ],

  conversation: [
    "Senin düşüncen ne? [Farklı perspektifler/deneyimin uyuşuyor mu] duymak isterim.",
    "[Bunu yaşayan] var mı? Yanıtlarda not alalım.",
    "Merak: [konu ile ilgili soru]? Deneyimini yanıtla.",
  ],

  vulnerability: [
    "[Durum]un ortasındaysan, yalnız değilsin. Anlayan biriyle konuşman gerekirse DM at.",
    "Sen de mi? Yanıtlarda paylaşalım. [Ortak mücadele] gerçek.",
    "Hala çözmeye çalışıyorum. [Problem]i çözdüysen, işe yarayanı yanıtla.",
  ],

  value: [
    "[X yapmak üzereysen] bookmark'la. [Durum] geldiğinde bu [dersler/taktikler] gerek.",
    "[Bu aşamaya gelince] sakla. Gelecekteki sen bugünkü sana teşekkür eder.",
    "[Bu durumda olan] biriyle paylaş. Takdir eder.",
  ],

  continuation: [
    "Bu [açık geliştirme/kurucu yolculuğu] sürecimin parçası. Takip ediyor musun? [Profil/önceki thread linki].",
    "Daha fazla [içerik türü] ister misin? [Sıklık] [konu] hakkında paylaşım yapıyorum.",
    "Faydalı olduysa, [konu] hakkında haftalık yazıyorum. Daha fazlası için [takip et].",
  ],
};

/**
 * Türkçe hook kalite kriterleri
 */
export const hookQualityCriteriaTurkish = {
  hasBoldStatement: "Şaşırtıcı/şok edici/karşıt ifade ile açılış",
  hasTension: "Mücadele, acı noktası veya zorluk içerir",
  hasTwist: "Beklenmedik içgörü veya sezgiye aykırı element içerir",
  hasCredibility: "Spesifik sayılar, metrikler veya kanıt içerir",
  hasSpecificity: "Genel terimlerden kaçınır, somut detaylar kullanır",
  createsCuriosity: "Okuyucuya 'nasıl' veya 'neden' merakı verir",
  isConversational: "İnsan gibi konuşur, robotik veya kurumsal değil",
  hasClearPromise: "Thread'in ne sunacağına dair beklenti yaratır",
};
