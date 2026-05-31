/**
 * @name GifSourcePlus
 * @author isimsizman09
 * @description Adds a separate KLIPY GIF tab next to Discord's GIF picker without mixing KLIPY results with Giphy results.
 * @version 0.2.4
 * @website https://github.com/isimsizman09/GifSourcePlus
 * @source https://github.com/isimsizman09/GifSourcePlus/blob/main/GifSourcePlus.plugin.js
 * @updateUrl https://raw.githubusercontent.com/isimsizman09/GifSourcePlus/main/GifSourcePlus.plugin.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const config = {
    info: {
        name: "GifSourcePlus",
        version: "0.2.4",
        description: "Adds a separate KLIPY GIF tab next to Discord's GIF picker.",
        authors: [{name: "isimsizman09"}]
    }
};

const PLUGIN_NAME = config.info.name;
const KLIPY_BASE = "https://api.klipy.com";
const UPDATE_URL = "https://raw.githubusercontent.com/isimsizman09/GifSourcePlus/main/GifSourcePlus.plugin.js";
const UPDATE_CHECK_DELAY_MS = 2500;
const UPDATE_CHECK_TIMEOUT_MS = 15000;

const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    apiKey: "",
    resultLimit: 24,
    locale: "en-US",
    guideLanguage: "en",
    endpointMode: "auto",
    insertMode: "send",
    qualityMode: "high",
    shortcutEnabled: true,
    checkForUpdates: true
});

const API_KEY_GUIDES = Object.freeze({
    tr: {
        name: "Türkçe",
        title: "KLIPY API anahtarı nasıl alınır?",
        intro: "GifSourcePlus ortak veya gizli bir anahtar içermez. Her kullanıcı kendi ücretsiz KLIPY geliştirici anahtarını girmelidir.",
        steps: [
            "KLIPY Developers sayfasını açın: https://klipy.com/developers.",
            "Kayıt olun veya mevcut KLIPY hesabınızla giriş yapın.",
            "Developer/API başvurusu veya dashboard bölümünden yeni bir uygulama oluşturun.",
            "Uygulama adı olarak GifSourcePlus veya kendi Discord kullanım açıklamanızı yazın.",
            "Size verilen API key değerini kopyalayın.",
            "Bu ayarlardaki KLIPY API key alanına yapıştırın ve ayarı kapatın.",
            "Discord GIF panelini açın, KLIPY sekmesine geçin ve arama yapın."
        ],
        note: "Anahtarınızı herkese açık repo, ekran görüntüsü veya destek mesajında paylaşmayın. Anahtar sadece BetterDiscord yerel eklenti verisinde saklanır."
    },
    en: {
        name: "English",
        title: "How to get a KLIPY API key",
        intro: "GifSourcePlus does not include a shared or hidden key. Each user should enter their own free KLIPY developer key.",
        steps: [
            "Open the KLIPY Developers page: https://klipy.com/developers.",
            "Sign up or log in with your existing KLIPY account.",
            "Create a new app from the Developer/API request or dashboard area.",
            "Use GifSourcePlus or your own Discord use case as the app name/description.",
            "Copy the API key KLIPY gives you.",
            "Paste it into the KLIPY API key field in these settings and close the settings panel.",
            "Open Discord's GIF picker, switch to the KLIPY tab, and search."
        ],
        note: "Do not share your key in public repositories, screenshots, or support messages. The key is stored only in BetterDiscord local plugin data."
    },
    zh: {
        name: "简体中文",
        title: "如何获取 KLIPY API 密钥",
        intro: "GifSourcePlus 不包含共享或隐藏密钥。每位用户都应输入自己的免费 KLIPY 开发者密钥。",
        steps: [
            "打开 KLIPY Developers 页面：https://klipy.com/developers。",
            "注册账号，或使用现有 KLIPY 账号登录。",
            "在 Developer/API 申请或 dashboard 区域创建一个新应用。",
            "应用名称或说明可填写 GifSourcePlus，或说明你的 Discord 使用场景。",
            "复制 KLIPY 提供的 API key。",
            "将它粘贴到本设置页的 KLIPY API key 字段，然后关闭设置面板。",
            "打开 Discord GIF 选择器，切换到 KLIPY 标签并搜索。"
        ],
        note: "不要在公开仓库、截图或支持消息中分享你的密钥。密钥只会保存在 BetterDiscord 的本地插件数据中。"
    },
    hi: {
        name: "हिन्दी",
        title: "KLIPY API key कैसे प्राप्त करें",
        intro: "GifSourcePlus में कोई साझा या छिपी हुई key शामिल नहीं है। हर उपयोगकर्ता को अपनी मुफ्त KLIPY developer key डालनी चाहिए।",
        steps: [
            "KLIPY Developers पेज खोलें: https://klipy.com/developers.",
            "साइन अप करें या अपने मौजूदा KLIPY खाते से लॉग इन करें।",
            "Developer/API request या dashboard क्षेत्र से नया app बनाएं।",
            "App name/description में GifSourcePlus या अपना Discord उपयोग लिखें।",
            "KLIPY द्वारा दी गई API key कॉपी करें।",
            "इसे इन settings में KLIPY API key field में paste करें और settings panel बंद करें।",
            "Discord का GIF picker खोलें, KLIPY tab चुनें और search करें।"
        ],
        note: "अपनी key को public repository, screenshot या support message में साझा न करें। key केवल BetterDiscord local plugin data में सेव होती है।"
    },
    es: {
        name: "Spanish",
        title: "Como obtener una clave API de KLIPY",
        intro: "GifSourcePlus no incluye una clave compartida ni oculta. Cada usuario debe ingresar su propia clave gratuita de desarrollador de KLIPY.",
        steps: [
            "Abre la pagina KLIPY Developers: https://klipy.com/developers.",
            "Registrate o inicia sesion con tu cuenta de KLIPY.",
            "Crea una nueva aplicacion desde la seccion Developer/API request o dashboard.",
            "Usa GifSourcePlus o tu caso de uso en Discord como nombre/descripcion.",
            "Copia la API key que te entregue KLIPY.",
            "Pegala en el campo KLIPY API key de estos ajustes y cierra el panel.",
            "Abre el selector de GIF de Discord, cambia a la pestana KLIPY y busca."
        ],
        note: "No compartas tu clave en repositorios publicos, capturas de pantalla ni mensajes de soporte. La clave se guarda solo en los datos locales del plugin de BetterDiscord."
    },
    ar: {
        name: "العربية",
        title: "كيفية الحصول على مفتاح KLIPY API",
        intro: "لا يتضمن GifSourcePlus مفتاحا مشتركا أو مخفيا. يجب على كل مستخدم إدخال مفتاح مطور KLIPY المجاني الخاص به.",
        steps: [
            "افتح صفحة KLIPY Developers: https://klipy.com/developers.",
            "أنشئ حسابا أو سجل الدخول بحساب KLIPY الحالي.",
            "أنشئ تطبيقا جديدا من قسم Developer/API request أو لوحة التحكم.",
            "اكتب GifSourcePlus أو وصف استخدامك في Discord كاسم/وصف للتطبيق.",
            "انسخ مفتاح API الذي يقدمه لك KLIPY.",
            "الصقه في حقل KLIPY API key داخل هذه الإعدادات ثم أغلق لوحة الإعدادات.",
            "افتح منتقي GIF في Discord، وانتقل إلى تبويب KLIPY، ثم ابحث."
        ],
        note: "لا تشارك مفتاحك في مستودعات عامة أو لقطات شاشة أو رسائل دعم. يتم حفظ المفتاح فقط في بيانات إضافة BetterDiscord المحلية."
    },
    bn: {
        name: "বাংলা",
        title: "KLIPY API key কীভাবে নেবেন",
        intro: "GifSourcePlus কোনো shared বা hidden key দেয় না। প্রত্যেক ব্যবহারকারীকে নিজের ফ্রি KLIPY developer key ব্যবহার করতে হবে।",
        steps: [
            "KLIPY Developers পেজ খুলুন: https://klipy.com/developers.",
            "সাইন আপ করুন অথবা আপনার KLIPY অ্যাকাউন্ট দিয়ে লগ ইন করুন।",
            "Developer/API request বা dashboard অংশ থেকে নতুন app তৈরি করুন।",
            "App name/description হিসেবে GifSourcePlus অথবা আপনার Discord ব্যবহারের উদ্দেশ্য লিখুন।",
            "KLIPY যে API key দেবে সেটি কপি করুন।",
            "এই settings-এর KLIPY API key ফিল্ডে paste করুন এবং settings panel বন্ধ করুন।",
            "Discord GIF picker খুলুন, KLIPY tab-এ যান এবং search করুন।"
        ],
        note: "আপনার key public repository, screenshot বা support message-এ শেয়ার করবেন না। key শুধু BetterDiscord local plugin data-তে সংরক্ষিত থাকে।"
    },
    fr: {
        name: "French",
        title: "Comment obtenir une cle API KLIPY",
        intro: "GifSourcePlus n'inclut aucune cle partagee ou cachee. Chaque utilisateur doit saisir sa propre cle developpeur KLIPY gratuite.",
        steps: [
            "Ouvrez la page KLIPY Developers : https://klipy.com/developers.",
            "Creez un compte ou connectez-vous avec votre compte KLIPY.",
            "Creez une nouvelle application depuis la zone Developer/API request ou dashboard.",
            "Indiquez GifSourcePlus ou votre usage Discord comme nom/description.",
            "Copiez la cle API fournie par KLIPY.",
            "Collez-la dans le champ KLIPY API key de ces parametres, puis fermez le panneau.",
            "Ouvrez le selecteur de GIF de Discord, passez a l'onglet KLIPY et lancez une recherche."
        ],
        note: "Ne partagez pas votre cle dans un depot public, une capture d'ecran ou un message de support. Elle est stockee uniquement dans les donnees locales du plugin BetterDiscord."
    },
    ru: {
        name: "Русский",
        title: "Как получить API-ключ KLIPY",
        intro: "GifSourcePlus не содержит общего или скрытого ключа. Каждый пользователь должен ввести свой бесплатный ключ разработчика KLIPY.",
        steps: [
            "Откройте страницу KLIPY Developers: https://klipy.com/developers.",
            "Зарегистрируйтесь или войдите в существующий аккаунт KLIPY.",
            "Создайте новое приложение в разделе Developer/API request или dashboard.",
            "Укажите GifSourcePlus или свое описание использования в Discord как имя/описание приложения.",
            "Скопируйте API key, выданный KLIPY.",
            "Вставьте его в поле KLIPY API key в этих настройках и закройте панель.",
            "Откройте GIF picker в Discord, перейдите на вкладку KLIPY и выполните поиск."
        ],
        note: "Не публикуйте ключ в открытых репозиториях, скриншотах или сообщениях поддержки. Ключ хранится только в локальных данных плагина BetterDiscord."
    },
    pt: {
        name: "Portuguese",
        title: "Como obter uma chave API da KLIPY",
        intro: "GifSourcePlus nao inclui uma chave compartilhada ou oculta. Cada usuario deve inserir sua propria chave gratuita de desenvolvedor da KLIPY.",
        steps: [
            "Abra a pagina KLIPY Developers: https://klipy.com/developers.",
            "Crie uma conta ou entre com sua conta KLIPY existente.",
            "Crie um novo app na area Developer/API request ou dashboard.",
            "Use GifSourcePlus ou seu caso de uso no Discord como nome/descricao.",
            "Copie a API key fornecida pela KLIPY.",
            "Cole no campo KLIPY API key destas configuracoes e feche o painel.",
            "Abra o seletor de GIFs do Discord, mude para a aba KLIPY e pesquise."
        ],
        note: "Nao compartilhe sua chave em repositorios publicos, capturas de tela ou mensagens de suporte. A chave fica salva apenas nos dados locais do plugin BetterDiscord."
    },
    ur: {
        name: "Urdu",
        title: "KLIPY API key kaise hasil karein",
        intro: "GifSourcePlus mein koi shared ya hidden key shamil nahi. Har user ko apni free KLIPY developer key enter karni chahiye.",
        steps: [
            "KLIPY Developers page kholen: https://klipy.com/developers.",
            "Sign up karein ya apne existing KLIPY account se log in karein.",
            "Developer/API request ya dashboard section se nayi app banayein.",
            "App name/description mein GifSourcePlus ya apna Discord use case likhein.",
            "KLIPY ki di hui API key copy karein.",
            "Use in settings ke KLIPY API key field mein paste karein aur settings panel band karein.",
            "Discord GIF picker kholen, KLIPY tab par jayein aur search karein."
        ],
        note: "Apni key public repository, screenshot ya support message mein share na karein. Key sirf BetterDiscord local plugin data mein save hoti hai."
    },
    id: {
        name: "Indonesian",
        title: "Cara mendapatkan KLIPY API key",
        intro: "GifSourcePlus tidak menyertakan key bersama atau tersembunyi. Setiap pengguna harus memasukkan KLIPY developer key gratis miliknya sendiri.",
        steps: [
            "Buka halaman KLIPY Developers: https://klipy.com/developers.",
            "Daftar atau masuk dengan akun KLIPY yang sudah ada.",
            "Buat app baru dari bagian Developer/API request atau dashboard.",
            "Gunakan GifSourcePlus atau deskripsi penggunaan Discord Anda sebagai nama/deskripsi app.",
            "Salin API key yang diberikan KLIPY.",
            "Tempelkan ke kolom KLIPY API key di pengaturan ini lalu tutup panel.",
            "Buka GIF picker Discord, pindah ke tab KLIPY, lalu cari."
        ],
        note: "Jangan bagikan key di repository publik, screenshot, atau pesan dukungan. Key hanya disimpan di data plugin lokal BetterDiscord."
    },
    de: {
        name: "German",
        title: "So erhalten Sie einen KLIPY API-Schluessel",
        intro: "GifSourcePlus enthaelt keinen gemeinsamen oder versteckten Schluessel. Jeder Benutzer muss seinen eigenen kostenlosen KLIPY-Developer-Schluessel eingeben.",
        steps: [
            "Oeffnen Sie die KLIPY Developers-Seite: https://klipy.com/developers.",
            "Registrieren Sie sich oder melden Sie sich mit Ihrem KLIPY-Konto an.",
            "Erstellen Sie im Bereich Developer/API request oder dashboard eine neue App.",
            "Verwenden Sie GifSourcePlus oder Ihren Discord-Anwendungsfall als App-Name/Beschreibung.",
            "Kopieren Sie den von KLIPY bereitgestellten API key.",
            "Fuegen Sie ihn in diesen Einstellungen in das Feld KLIPY API key ein und schliessen Sie das Panel.",
            "Oeffnen Sie den Discord-GIF-Picker, wechseln Sie zum KLIPY-Tab und suchen Sie."
        ],
        note: "Teilen Sie Ihren Schluessel nicht in oeffentlichen Repositories, Screenshots oder Support-Nachrichten. Er wird nur in den lokalen BetterDiscord-Plugin-Daten gespeichert."
    },
    ja: {
        name: "日本語",
        title: "KLIPY API key の取得方法",
        intro: "GifSourcePlus には共有 key や隠し key は含まれていません。各ユーザーが自分の無料 KLIPY developer key を入力する必要があります。",
        steps: [
            "KLIPY Developers ページを開きます: https://klipy.com/developers.",
            "新規登録するか、既存の KLIPY アカウントでログインします。",
            "Developer/API request または dashboard から新しい app を作成します。",
            "App name/description に GifSourcePlus または Discord での利用目的を書きます。",
            "KLIPY から発行された API key をコピーします。",
            "この settings の KLIPY API key 欄に貼り付け、settings panel を閉じます。",
            "Discord の GIF picker を開き、KLIPY tab に切り替えて検索します。"
        ],
        note: "key を public repository、screenshot、support message で共有しないでください。key は BetterDiscord local plugin data にのみ保存されます。"
    },
    ko: {
        name: "한국어",
        title: "KLIPY API key 받는 방법",
        intro: "GifSourcePlus에는 공유 key나 숨겨진 key가 포함되어 있지 않습니다. 각 사용자는 자신의 무료 KLIPY developer key를 입력해야 합니다.",
        steps: [
            "KLIPY Developers page를 엽니다: https://klipy.com/developers.",
            "가입하거나 기존 KLIPY account로 log in합니다.",
            "Developer/API request 또는 dashboard 영역에서 새 app을 만듭니다.",
            "App name/description에 GifSourcePlus 또는 Discord 사용 목적을 입력합니다.",
            "KLIPY가 제공한 API key를 copy합니다.",
            "이 settings의 KLIPY API key field에 paste하고 settings panel을 닫습니다.",
            "Discord GIF picker를 열고 KLIPY tab으로 전환한 뒤 search합니다."
        ],
        note: "key를 public repository, screenshot, support message에 공유하지 마세요. key는 BetterDiscord local plugin data에만 저장됩니다."
    },
    vi: {
        name: "Vietnamese",
        title: "Cach lay KLIPY API key",
        intro: "GifSourcePlus khong kem key dung chung hay key an. Moi nguoi dung nen nhap KLIPY developer key mien phi cua rieng minh.",
        steps: [
            "Mo trang KLIPY Developers: https://klipy.com/developers.",
            "Dang ky hoac dang nhap bang tai khoan KLIPY hien co.",
            "Tao app moi trong muc Developer/API request hoac dashboard.",
            "Dung GifSourcePlus hoac mo ta cach ban dung Discord lam ten/mo ta app.",
            "Sao chep API key ma KLIPY cung cap.",
            "Dan vao truong KLIPY API key trong settings nay roi dong panel.",
            "Mo GIF picker cua Discord, chuyen sang tab KLIPY va tim kiem."
        ],
        note: "Khong chia se key trong repository cong khai, anh chup man hinh hoac tin nhan ho tro. Key chi duoc luu trong du lieu plugin cuc bo cua BetterDiscord."
    },
    it: {
        name: "Italian",
        title: "Come ottenere una chiave API KLIPY",
        intro: "GifSourcePlus non include una chiave condivisa o nascosta. Ogni utente deve inserire la propria chiave sviluppatore KLIPY gratuita.",
        steps: [
            "Apri la pagina KLIPY Developers: https://klipy.com/developers.",
            "Registrati o accedi con il tuo account KLIPY.",
            "Crea una nuova app dalla sezione Developer/API request o dashboard.",
            "Usa GifSourcePlus o il tuo caso d'uso Discord come nome/descrizione.",
            "Copia la API key fornita da KLIPY.",
            "Incollala nel campo KLIPY API key di queste impostazioni e chiudi il pannello.",
            "Apri il selettore GIF di Discord, passa alla scheda KLIPY e cerca."
        ],
        note: "Non condividere la chiave in repository pubblici, screenshot o messaggi di supporto. La chiave viene salvata solo nei dati locali del plugin BetterDiscord."
    },
    fa: {
        name: "فارسی",
        title: "چگونه KLIPY API key بگیرید",
        intro: "GifSourcePlus هیچ key مشترک یا مخفی ندارد. هر کاربر باید KLIPY developer key رایگان خودش را وارد کند.",
        steps: [
            "صفحه KLIPY Developers را باز کنید: https://klipy.com/developers.",
            "ثبت نام کنید یا با حساب KLIPY خود وارد شوید.",
            "از بخش Developer/API request یا dashboard یک app جدید بسازید.",
            "برای نام/توضیح app از GifSourcePlus یا توضیح استفاده Discord خود استفاده کنید.",
            "API key ارائه شده توسط KLIPY را کپی کنید.",
            "آن را در فیلد KLIPY API key در این settings وارد کنید و پنل را ببندید.",
            "GIF picker دیسکورد را باز کنید، به tab KLIPY بروید و جستجو کنید."
        ],
        note: "key خود را در repository عمومی، screenshot یا پیام پشتیبانی منتشر نکنید. key فقط در داده محلی plugin در BetterDiscord ذخیره می شود."
    },
    sw: {
        name: "Swahili",
        title: "Jinsi ya kupata KLIPY API key",
        intro: "GifSourcePlus haina key ya pamoja au iliyofichwa. Kila mtumiaji anatakiwa kuingiza KLIPY developer key yake ya bure.",
        steps: [
            "Fungua ukurasa wa KLIPY Developers: https://klipy.com/developers.",
            "Jisajili au ingia kwa akaunti yako ya KLIPY.",
            "Tengeneza app mpya kwenye sehemu ya Developer/API request au dashboard.",
            "Tumia GifSourcePlus au maelezo ya matumizi yako ya Discord kama jina/maelezo ya app.",
            "Nakili API key utakayopewa na KLIPY.",
            "Ibandike kwenye sehemu ya KLIPY API key katika settings hizi kisha funga paneli.",
            "Fungua GIF picker ya Discord, chagua tab ya KLIPY, kisha tafuta."
        ],
        note: "Usishiriki key yako kwenye repository ya umma, screenshot, au ujumbe wa support. Key huhifadhiwa tu kwenye data ya ndani ya plugin ya BetterDiscord."
    },
    fil: {
        name: "Filipino",
        title: "Paano kumuha ng KLIPY API key",
        intro: "Walang kasamang shared o hidden key ang GifSourcePlus. Dapat ilagay ng bawat user ang sarili niyang libreng KLIPY developer key.",
        steps: [
            "Buksan ang KLIPY Developers page: https://klipy.com/developers.",
            "Mag-sign up o mag-log in gamit ang iyong KLIPY account.",
            "Gumawa ng bagong app mula sa Developer/API request o dashboard section.",
            "Gamitin ang GifSourcePlus o ang iyong Discord use case bilang app name/description.",
            "Kopyahin ang API key na ibibigay ng KLIPY.",
            "I-paste ito sa KLIPY API key field sa settings na ito at isara ang panel.",
            "Buksan ang Discord GIF picker, lumipat sa KLIPY tab, at mag-search."
        ],
        note: "Huwag ibahagi ang key sa public repository, screenshot, o support message. Naka-save lang ito sa local plugin data ng BetterDiscord."
    }
});

const SETTINGS_COPY = Object.freeze({
    en: {
        headerDescription: "Adds a separate KLIPY tab to Discord's GIF picker. Configure the API key, language, behavior, and media quality here.",
        sections: {
            language: "Language",
            access: "KLIPY Access",
            behavior: "Picker Behavior",
            guide: "API Key Guide"
        },
        footer: "Not affiliated with Discord or KLIPY. KLIPY results stay separate and are attributed as Powered by KLIPY.",
        fields: {
            language: ["Settings language", "Controls every label, help text, and the API key guide in this settings panel."],
            enabled: ["Enable KLIPY tab", "Show a separate KLIPY tab inside Discord's GIF picker."],
            apiKey: ["KLIPY API key", "Stored only in BetterDiscord local plugin data. It is never bundled with the plugin file.", "Paste your KLIPY API key"],
            resultLimit: ["Result limit", "Number of GIFs requested per search. Range: 8-50."],
            locale: ["Locale", "Locale sent to KLIPY requests. Example: en-US, tr-TR."],
            endpointMode: ["Endpoint mode", "Auto tries the current KLIPY v1 endpoint first and falls back to the Tenor-compatible v2 style if needed."],
            insertMode: ["GIF click action", "Send posts the GIF URL directly to the current channel. Copy is a safe fallback."],
            qualityMode: ["Media quality", "High uses the best available GIF URL for previews and sends. Balanced keeps lighter previews while sending the best URL."],
            shortcutEnabled: ["Open KLIPY with Ctrl+G", "When enabled, Ctrl+G opens the GIF picker directly on the KLIPY tab."]
        },
        options: {
            endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"},
            insertMode: {send: "Send GIF immediately", copy: "Copy URL to clipboard"},
            qualityMode: {high: "High quality", balanced: "Balanced"}
        },
        actions: {show: "Show", hide: "Hide"}
    },
    tr: {
        headerDescription: "Discord GIF seçicisine ayrı bir KLIPY sekmesi ekler. API anahtarını, dili, davranışı ve medya kalitesini buradan ayarlayın.",
        sections: {language: "Dil", access: "KLIPY Erişimi", behavior: "Seçici Davranışı", guide: "API Anahtarı Rehberi"},
        footer: "Discord veya KLIPY ile bağlı değildir. KLIPY sonuçları ayrı gösterilir ve Powered by KLIPY olarak belirtilir.",
        fields: {
            language: ["Ayar dili", "Bu ayar panelindeki tüm etiketleri, yardım metinlerini ve API rehberini belirler."],
            enabled: ["KLIPY sekmesini etkinleştir", "Discord GIF seçicisi içinde ayrı bir KLIPY sekmesi göster."],
            apiKey: ["KLIPY API anahtarı", "Sadece BetterDiscord yerel eklenti verisinde saklanır. Eklenti dosyasına gömülmez.", "KLIPY API anahtarınızı yapıştırın"],
            resultLimit: ["Sonuç limiti", "Her aramada istenecek GIF sayısı. Aralık: 8-50."],
            locale: ["Yerel ayar", "KLIPY isteklerine gönderilen locale. Örnek: en-US, tr-TR."],
            endpointMode: ["Endpoint modu", "Auto önce güncel KLIPY v1 endpointini dener, gerekirse Tenor uyumlu v2 biçimine döner."],
            insertMode: ["GIF tıklama eylemi", "Send GIF URL'sini doğrudan geçerli kanala gönderir. Copy güvenli yedektir."],
            qualityMode: ["Medya kalitesi", "High önizleme ve gönderim için en iyi GIF URL'sini kullanır. Balanced daha hafif önizleme kullanıp en iyi URL'yi gönderir."],
            shortcutEnabled: ["Ctrl+G ile KLIPY'yi aç", "Etkin olduğunda Ctrl+G, GIF seçicisini doğrudan KLIPY sekmesinde açar."]
        },
        options: {
            endpointMode: {auto: "Otomatik", v1: "KLIPY v1", v2: "Tenor uyumlu v2"},
            insertMode: {send: "GIF'i hemen gönder", copy: "URL'yi panoya kopyala"},
            qualityMode: {high: "Yüksek kalite", balanced: "Dengeli"}
        },
        actions: {show: "Göster", hide: "Gizle"}
    },
    zh: {
        headerDescription: "在 Discord GIF 选择器中添加独立的 KLIPY 标签页。可配置 API key、语言、行为和媒体质量。",
        sections: {language: "语言", access: "KLIPY 访问", behavior: "选择器行为", guide: "API key 指南"},
        fields: {
            language: ["设置语言", "控制此设置面板中的所有标签、帮助文本和 API key 指南。"],
            enabled: ["启用 KLIPY 标签页", "在 Discord GIF 选择器中显示独立的 KLIPY 标签页。"],
            apiKey: ["KLIPY API key", "只保存在 BetterDiscord 本地插件数据中，不会打包进插件文件。", "粘贴你的 KLIPY API key"],
            resultLimit: ["结果数量", "每次搜索请求的 GIF 数量。范围：8-50。"],
            locale: ["区域设置", "发送给 KLIPY 请求的 locale。例如：en-US, zh-CN。"],
            endpointMode: ["Endpoint 模式", "Auto 会先尝试当前 KLIPY v1 endpoint，必要时回退到 Tenor 兼容 v2。"],
            insertMode: ["GIF 点击动作", "Send 会直接把 GIF URL 发到当前频道。Copy 是安全备用方案。"],
            qualityMode: ["媒体质量", "High 为预览和发送使用最佳 GIF URL。Balanced 使用较轻预览但发送最佳 URL。"]
        },
        options: {endpointMode: {auto: "自动", v1: "KLIPY v1", v2: "Tenor 兼容 v2"}, insertMode: {send: "立即发送 GIF", copy: "复制 URL"}, qualityMode: {high: "高质量", balanced: "均衡"}}
    },
    hi: {
        headerDescription: "Discord GIF picker में अलग KLIPY tab जोड़ता है। API key, भाषा, व्यवहार और media quality यहां सेट करें।",
        sections: {language: "भाषा", access: "KLIPY access", behavior: "Picker behavior", guide: "API key guide"},
        fields: {
            language: ["Settings language", "इस settings panel के सभी labels, help text और API key guide को नियंत्रित करता है।"],
            enabled: ["KLIPY tab enable करें", "Discord GIF picker में अलग KLIPY tab दिखाएं।"],
            apiKey: ["KLIPY API key", "सिर्फ BetterDiscord local plugin data में stored रहती है। Plugin file में bundle नहीं होती।", "अपनी KLIPY API key paste करें"],
            resultLimit: ["Result limit", "हर search में मांगे जाने वाले GIFs की संख्या। Range: 8-50।"],
            locale: ["Locale", "KLIPY requests में भेजा जाने वाला locale। Example: en-US, hi-IN।"],
            endpointMode: ["Endpoint mode", "Auto पहले KLIPY v1 endpoint try करता है, जरूरत पर Tenor-compatible v2 fallback करता है।"],
            insertMode: ["GIF click action", "Send GIF URL को current channel में भेजता है। Copy safe fallback है।"],
            qualityMode: ["Media quality", "High previews और sends में best GIF URL इस्तेमाल करता है। Balanced हल्के previews रखता है।"]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "GIF तुरंत भेजें", copy: "URL copy करें"}, qualityMode: {high: "High quality", balanced: "Balanced"}}
    },
    es: {
        headerDescription: "Agrega una pestaña KLIPY separada al selector de GIF de Discord. Configura la API key, idioma, comportamiento y calidad.",
        sections: {language: "Idioma", access: "Acceso KLIPY", behavior: "Comportamiento", guide: "Guia de API key"},
        fields: {
            language: ["Idioma de ajustes", "Controla todas las etiquetas, ayudas y la guia de API key de este panel."],
            enabled: ["Activar pestaña KLIPY", "Muestra una pestaña KLIPY separada dentro del selector de GIF de Discord."],
            apiKey: ["KLIPY API key", "Se guarda solo en los datos locales de BetterDiscord. Nunca se incluye en el archivo del plugin.", "Pega tu KLIPY API key"],
            resultLimit: ["Limite de resultados", "Cantidad de GIFs solicitados por busqueda. Rango: 8-50."],
            locale: ["Locale", "Locale enviado a KLIPY. Ejemplo: en-US, es-ES."],
            endpointMode: ["Modo endpoint", "Auto prueba primero KLIPY v1 y vuelve al modo v2 compatible con Tenor si hace falta."],
            insertMode: ["Accion al hacer clic", "Send publica la URL del GIF en el canal actual. Copy es el respaldo seguro."],
            qualityMode: ["Calidad multimedia", "High usa la mejor URL GIF para vistas previas y envios. Balanced usa previews mas livianos."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 compatible con Tenor"}, insertMode: {send: "Enviar GIF ahora", copy: "Copiar URL"}, qualityMode: {high: "Alta calidad", balanced: "Equilibrado"}},
        actions: {show: "Mostrar", hide: "Ocultar"}
    },
    ar: {
        headerDescription: "يضيف تبويب KLIPY مستقلا إلى منتقي GIF في Discord. اضبط مفتاح API واللغة والسلوك وجودة الوسائط هنا.",
        sections: {language: "اللغة", access: "وصول KLIPY", behavior: "سلوك المنتقي", guide: "دليل مفتاح API"},
        fields: {
            language: ["لغة الإعدادات", "تتحكم بكل التسميات ونصوص المساعدة ودليل مفتاح API في هذه اللوحة."],
            enabled: ["تفعيل تبويب KLIPY", "إظهار تبويب KLIPY منفصل داخل منتقي GIF في Discord."],
            apiKey: ["مفتاح KLIPY API", "يحفظ فقط في بيانات BetterDiscord المحلية ولا يدمج داخل ملف الإضافة.", "الصق مفتاح KLIPY API"],
            resultLimit: ["حد النتائج", "عدد صور GIF المطلوبة في كل بحث. النطاق: 8-50."],
            locale: ["اللغة المحلية", "قيمة locale المرسلة إلى KLIPY. مثال: en-US, ar-SA."],
            endpointMode: ["وضع endpoint", "Auto يجرب KLIPY v1 أولا ثم ينتقل إلى v2 المتوافق مع Tenor عند الحاجة."],
            insertMode: ["إجراء النقر على GIF", "Send يرسل رابط GIF إلى القناة الحالية. Copy خيار احتياطي آمن."],
            qualityMode: ["جودة الوسائط", "High يستخدم أفضل رابط GIF للمعاينة والإرسال. Balanced يستخدم معاينات أخف."]
        },
        options: {endpointMode: {auto: "تلقائي", v1: "KLIPY v1", v2: "v2 متوافق مع Tenor"}, insertMode: {send: "إرسال GIF فورا", copy: "نسخ الرابط"}, qualityMode: {high: "جودة عالية", balanced: "متوازن"}},
        actions: {show: "إظهار", hide: "إخفاء"},
        dir: "rtl"
    },
    fr: {
        headerDescription: "Ajoute un onglet KLIPY separe au selecteur de GIF Discord. Configurez la cle API, la langue, le comportement et la qualite.",
        sections: {language: "Langue", access: "Acces KLIPY", behavior: "Comportement", guide: "Guide de cle API"},
        fields: {
            language: ["Langue des parametres", "Controle toutes les etiquettes, aides et le guide de cle API de ce panneau."],
            enabled: ["Activer l'onglet KLIPY", "Affiche un onglet KLIPY separe dans le selecteur de GIF Discord."],
            apiKey: ["Cle API KLIPY", "Stockee uniquement dans les donnees locales BetterDiscord. Jamais integree au fichier du plugin.", "Collez votre cle API KLIPY"],
            resultLimit: ["Limite de resultats", "Nombre de GIF demandes par recherche. Plage : 8-50."],
            locale: ["Locale", "Locale envoyee aux requetes KLIPY. Exemple : en-US, fr-FR."],
            endpointMode: ["Mode endpoint", "Auto essaie KLIPY v1 puis bascule vers v2 compatible Tenor si necessaire."],
            insertMode: ["Action au clic", "Send publie l'URL du GIF dans le salon actuel. Copy est le repli sur."],
            qualityMode: ["Qualite media", "High utilise la meilleure URL GIF pour les apercus et l'envoi. Balanced garde des apercus plus legers."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 compatible Tenor"}, insertMode: {send: "Envoyer le GIF", copy: "Copier l'URL"}, qualityMode: {high: "Haute qualite", balanced: "Equilibre"}},
        actions: {show: "Afficher", hide: "Masquer"}
    },
    de: {
        headerDescription: "Fuegt dem Discord-GIF-Picker einen separaten KLIPY-Tab hinzu. API key, Sprache, Verhalten und Qualitaet hier einstellen.",
        sections: {language: "Sprache", access: "KLIPY-Zugriff", behavior: "Picker-Verhalten", guide: "API-key-Anleitung"},
        fields: {
            language: ["Einstellungssprache", "Steuert alle Labels, Hilfetexte und die API-key-Anleitung in diesem Panel."],
            enabled: ["KLIPY-Tab aktivieren", "Zeigt einen separaten KLIPY-Tab im Discord-GIF-Picker."],
            apiKey: ["KLIPY API key", "Wird nur in lokalen BetterDiscord-Plugin-Daten gespeichert und nie in die Plugin-Datei gepackt.", "KLIPY API key einfuegen"],
            resultLimit: ["Ergebnislimit", "Anzahl der GIFs pro Suche. Bereich: 8-50."],
            locale: ["Locale", "Locale fuer KLIPY-Anfragen. Beispiel: en-US, de-DE."],
            endpointMode: ["Endpoint-Modus", "Auto versucht zuerst KLIPY v1 und faellt bei Bedarf auf Tenor-kompatibles v2 zurueck."],
            insertMode: ["GIF-Klickaktion", "Send postet die GIF-URL direkt in den aktuellen Kanal. Copy ist der sichere Fallback."],
            qualityMode: ["Medienqualitaet", "High nutzt die beste GIF-URL fuer Vorschau und Versand. Balanced nutzt leichtere Vorschauen."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-kompatibles v2"}, insertMode: {send: "GIF sofort senden", copy: "URL kopieren"}, qualityMode: {high: "Hohe Qualitaet", balanced: "Ausgewogen"}},
        actions: {show: "Anzeigen", hide: "Verbergen"}
    },
    pt: {
        headerDescription: "Adiciona uma aba KLIPY separada ao seletor de GIF do Discord. Configure API key, idioma, comportamento e qualidade.",
        sections: {language: "Idioma", access: "Acesso KLIPY", behavior: "Comportamento", guide: "Guia da API key"},
        fields: {
            language: ["Idioma das configuracoes", "Controla todos os rotulos, textos de ajuda e o guia da API key neste painel."],
            enabled: ["Ativar aba KLIPY", "Mostra uma aba KLIPY separada no seletor de GIF do Discord."],
            apiKey: ["KLIPY API key", "Salva apenas nos dados locais do BetterDiscord. Nunca e incluida no arquivo do plugin.", "Cole sua KLIPY API key"],
            resultLimit: ["Limite de resultados", "Numero de GIFs solicitados por busca. Faixa: 8-50."],
            locale: ["Locale", "Locale enviado a KLIPY. Exemplo: en-US, pt-BR."],
            endpointMode: ["Modo endpoint", "Auto tenta KLIPY v1 primeiro e volta ao v2 compativel com Tenor se necessario."],
            insertMode: ["Acao ao clicar no GIF", "Send envia a URL do GIF ao canal atual. Copy e o fallback seguro."],
            qualityMode: ["Qualidade da midia", "High usa a melhor URL GIF para previews e envios. Balanced usa previews mais leves."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 compativel com Tenor"}, insertMode: {send: "Enviar GIF agora", copy: "Copiar URL"}, qualityMode: {high: "Alta qualidade", balanced: "Equilibrado"}},
        actions: {show: "Mostrar", hide: "Ocultar"}
    },
    it: {
        headerDescription: "Aggiunge una scheda KLIPY separata al selettore GIF di Discord. Configura API key, lingua, comportamento e qualita.",
        sections: {language: "Lingua", access: "Accesso KLIPY", behavior: "Comportamento", guide: "Guida API key"},
        fields: {
            language: ["Lingua impostazioni", "Controlla tutte le etichette, gli aiuti e la guida API key in questo pannello."],
            enabled: ["Abilita scheda KLIPY", "Mostra una scheda KLIPY separata nel selettore GIF di Discord."],
            apiKey: ["KLIPY API key", "Salvata solo nei dati locali BetterDiscord. Non viene mai inclusa nel file plugin.", "Incolla la tua KLIPY API key"],
            resultLimit: ["Limite risultati", "Numero di GIF richieste per ricerca. Intervallo: 8-50."],
            locale: ["Locale", "Locale inviato alle richieste KLIPY. Esempio: en-US, it-IT."],
            endpointMode: ["Modalita endpoint", "Auto prova KLIPY v1 e poi il v2 compatibile Tenor se necessario."],
            insertMode: ["Azione clic GIF", "Send invia l'URL GIF al canale corrente. Copy e il fallback sicuro."],
            qualityMode: ["Qualita media", "High usa la migliore URL GIF per anteprime e invio. Balanced usa anteprime piu leggere."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 compatibile Tenor"}, insertMode: {send: "Invia GIF subito", copy: "Copia URL"}, qualityMode: {high: "Alta qualita", balanced: "Bilanciato"}},
        actions: {show: "Mostra", hide: "Nascondi"}
    },
    id: {
        headerDescription: "Menambahkan tab KLIPY terpisah ke pemilih GIF Discord. Atur API key, bahasa, perilaku, dan kualitas media di sini.",
        sections: {language: "Bahasa", access: "Akses KLIPY", behavior: "Perilaku Picker", guide: "Panduan API key"},
        fields: {
            language: ["Bahasa pengaturan", "Mengatur semua label, teks bantuan, dan panduan API key di panel ini."],
            enabled: ["Aktifkan tab KLIPY", "Tampilkan tab KLIPY terpisah di dalam pemilih GIF Discord."],
            apiKey: ["KLIPY API key", "Disimpan hanya di data plugin lokal BetterDiscord. Tidak pernah dibundel ke file plugin.", "Tempel KLIPY API key Anda"],
            resultLimit: ["Batas hasil", "Jumlah GIF yang diminta per pencarian. Rentang: 8-50."],
            locale: ["Locale", "Locale yang dikirim ke request KLIPY. Contoh: en-US, id-ID."],
            endpointMode: ["Mode endpoint", "Auto mencoba KLIPY v1 dulu lalu fallback ke v2 kompatibel Tenor bila perlu."],
            insertMode: ["Aksi klik GIF", "Send mengirim URL GIF ke channel saat ini. Copy adalah fallback aman."],
            qualityMode: ["Kualitas media", "High memakai URL GIF terbaik untuk preview dan kirim. Balanced memakai preview lebih ringan."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 kompatibel Tenor"}, insertMode: {send: "Kirim GIF sekarang", copy: "Salin URL"}, qualityMode: {high: "Kualitas tinggi", balanced: "Seimbang"}},
        actions: {show: "Tampilkan", hide: "Sembunyikan"}
    },
    vi: {
        headerDescription: "Them tab KLIPY rieng vao GIF picker cua Discord. Cau hinh API key, ngon ngu, hanh vi va chat luong media tai day.",
        sections: {language: "Ngon ngu", access: "Truy cap KLIPY", behavior: "Hanh vi picker", guide: "Huong dan API key"},
        fields: {
            language: ["Ngon ngu cai dat", "Dieu khien tat ca label, help text va huong dan API key trong panel nay."],
            enabled: ["Bat tab KLIPY", "Hien thi tab KLIPY rieng trong GIF picker cua Discord."],
            apiKey: ["KLIPY API key", "Chi luu trong du lieu plugin cuc bo BetterDiscord. Khong bao gio dong goi vao file plugin.", "Dan KLIPY API key cua ban"],
            resultLimit: ["Gioi han ket qua", "So GIF yeu cau moi lan tim kiem. Khoang: 8-50."],
            locale: ["Locale", "Locale gui den KLIPY request. Vi du: en-US, vi-VN."],
            endpointMode: ["Che do endpoint", "Auto thu KLIPY v1 truoc, neu can se fallback sang v2 tuong thich Tenor."],
            insertMode: ["Hanh dong khi bam GIF", "Send gui URL GIF vao kenh hien tai. Copy la fallback an toan."],
            qualityMode: ["Chat luong media", "High dung URL GIF tot nhat cho preview va gui. Balanced dung preview nhe hon."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 tuong thich Tenor"}, insertMode: {send: "Gui GIF ngay", copy: "Sao chep URL"}, qualityMode: {high: "Chat luong cao", balanced: "Can bang"}},
        actions: {show: "Hien", hide: "An"}
    },
    sw: {
        headerDescription: "Huongeza tab tofauti ya KLIPY kwenye kichagua GIF cha Discord. Sanidi API key, lugha, tabia, na ubora wa media hapa.",
        sections: {language: "Lugha", access: "Ufikiaji KLIPY", behavior: "Tabia ya kichagua", guide: "Mwongozo wa API key"},
        fields: {
            language: ["Lugha ya mipangilio", "Hudhibiti labels, maelezo ya msaada, na mwongozo wa API key kwenye paneli hii."],
            enabled: ["Washa tab ya KLIPY", "Onyesha tab tofauti ya KLIPY ndani ya kichagua GIF cha Discord."],
            apiKey: ["KLIPY API key", "Huhifadhiwa tu kwenye data ya ndani ya BetterDiscord. Haijumuishwi kwenye faili ya plugin.", "Bandika KLIPY API key yako"],
            resultLimit: ["Kikomo cha matokeo", "Idadi ya GIF zinazoombwa kwa kila utafutaji. Kiwango: 8-50."],
            locale: ["Locale", "Locale inayotumwa kwenye maombi ya KLIPY. Mfano: en-US, sw-KE."],
            endpointMode: ["Hali ya endpoint", "Auto hujaribu KLIPY v1 kwanza na kurudi v2 inayoendana na Tenor ikihitajika."],
            insertMode: ["Kitendo cha kubofya GIF", "Send hutuma URL ya GIF kwenye channel ya sasa. Copy ni fallback salama."],
            qualityMode: ["Ubora wa media", "High hutumia URL bora ya GIF kwa preview na kutuma. Balanced hutumia preview nyepesi."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "v2 inayoendana na Tenor"}, insertMode: {send: "Tuma GIF sasa", copy: "Nakili URL"}, qualityMode: {high: "Ubora wa juu", balanced: "Wastani"}},
        actions: {show: "Onyesha", hide: "Ficha"}
    },
    fil: {
        headerDescription: "Nagdaragdag ng hiwalay na KLIPY tab sa Discord GIF picker. I-configure ang API key, wika, kilos, at media quality dito.",
        sections: {language: "Wika", access: "KLIPY Access", behavior: "Picker Behavior", guide: "API key Guide"},
        fields: {
            language: ["Wika ng settings", "Kinokontrol ang lahat ng label, help text, at API key guide sa panel na ito."],
            enabled: ["I-enable ang KLIPY tab", "Magpakita ng hiwalay na KLIPY tab sa Discord GIF picker."],
            apiKey: ["KLIPY API key", "Naka-save lang sa local BetterDiscord plugin data. Hindi ito kasama sa plugin file.", "I-paste ang iyong KLIPY API key"],
            resultLimit: ["Limit ng resulta", "Bilang ng GIF na ire-request bawat search. Range: 8-50."],
            locale: ["Locale", "Locale na ipinapadala sa KLIPY requests. Halimbawa: en-US, fil-PH."],
            endpointMode: ["Endpoint mode", "Auto muna sa KLIPY v1 at fallback sa Tenor-compatible v2 kung kailangan."],
            insertMode: ["GIF click action", "Send ipinapadala ang GIF URL sa current channel. Copy ang safe fallback."],
            qualityMode: ["Media quality", "High gumagamit ng best GIF URL para sa preview at send. Balanced gumagamit ng mas magaan na preview."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "I-send agad ang GIF", copy: "Kopyahin ang URL"}, qualityMode: {high: "High quality", balanced: "Balanced"}},
        actions: {show: "Ipakita", hide: "Itago"}
    },
    ru: {
        headerDescription: "Добавляет отдельную вкладку KLIPY в GIF-пикер Discord. Здесь настраиваются API key, язык, поведение и качество медиа.",
        sections: {language: "Язык", access: "Доступ KLIPY", behavior: "Поведение пикера", guide: "Инструкция API key"},
        fields: {
            language: ["Язык настроек", "Управляет всеми подписями, подсказками и инструкцией API key в этой панели."],
            enabled: ["Включить вкладку KLIPY", "Показывать отдельную вкладку KLIPY внутри GIF-пикера Discord."],
            apiKey: ["KLIPY API key", "Хранится только в локальных данных BetterDiscord и не встраивается в файл плагина.", "Вставьте ваш KLIPY API key"],
            resultLimit: ["Лимит результатов", "Количество GIF на один поиск. Диапазон: 8-50."],
            locale: ["Locale", "Locale для запросов KLIPY. Пример: en-US, ru-RU."],
            endpointMode: ["Режим endpoint", "Auto сначала пробует KLIPY v1, затем при необходимости v2, совместимый с Tenor."],
            insertMode: ["Действие по клику GIF", "Send отправляет GIF URL в текущий канал. Copy - безопасный fallback."],
            qualityMode: ["Качество медиа", "High использует лучший GIF URL для предпросмотра и отправки. Balanced использует более легкие preview."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "Отправить GIF сразу", copy: "Копировать URL"}, qualityMode: {high: "Высокое качество", balanced: "Сбалансировано"}},
        actions: {show: "Показать", hide: "Скрыть"}
    },
    ja: {
        headerDescription: "Discord の GIF picker に独立した KLIPY tab を追加します。API key、言語、動作、media quality を設定できます。",
        sections: {language: "言語", access: "KLIPY access", behavior: "Picker behavior", guide: "API key guide"},
        fields: {
            language: ["Settings language", "この settings panel の labels、help text、API key guide を制御します。"],
            enabled: ["KLIPY tab を有効化", "Discord GIF picker 内に独立した KLIPY tab を表示します。"],
            apiKey: ["KLIPY API key", "BetterDiscord local plugin data にのみ保存され、plugin file には含まれません。", "KLIPY API key を貼り付け"],
            resultLimit: ["Result limit", "検索ごとに要求する GIF 数。範囲: 8-50。"],
            locale: ["Locale", "KLIPY request に送る locale。例: en-US, ja-JP。"],
            endpointMode: ["Endpoint mode", "Auto は KLIPY v1 を先に試し、必要なら Tenor-compatible v2 に fallback します。"],
            insertMode: ["GIF click action", "Send は GIF URL を現在の channel に送信します。Copy は安全な fallback です。"],
            qualityMode: ["Media quality", "High は preview と send に最良の GIF URL を使います。Balanced は軽い preview を使います。"]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "GIF をすぐ送信", copy: "URL をコピー"}, qualityMode: {high: "High quality", balanced: "Balanced"}},
        actions: {show: "表示", hide: "隠す"}
    },
    ko: {
        headerDescription: "Discord GIF picker에 별도 KLIPY tab을 추가합니다. API key, 언어, 동작, media quality를 설정합니다.",
        sections: {language: "언어", access: "KLIPY access", behavior: "Picker behavior", guide: "API key guide"},
        fields: {
            language: ["Settings language", "이 settings panel의 labels, help text, API key guide를 제어합니다."],
            enabled: ["KLIPY tab 활성화", "Discord GIF picker 안에 별도 KLIPY tab을 표시합니다."],
            apiKey: ["KLIPY API key", "BetterDiscord local plugin data에만 저장되며 plugin file에 포함되지 않습니다.", "KLIPY API key 붙여넣기"],
            resultLimit: ["Result limit", "검색마다 요청할 GIF 수. 범위: 8-50."],
            locale: ["Locale", "KLIPY request에 보낼 locale. 예: en-US, ko-KR."],
            endpointMode: ["Endpoint mode", "Auto는 KLIPY v1을 먼저 시도하고 필요하면 Tenor-compatible v2로 fallback합니다."],
            insertMode: ["GIF click action", "Send는 GIF URL을 현재 channel에 보냅니다. Copy는 안전한 fallback입니다."],
            qualityMode: ["Media quality", "High는 preview와 send에 최적 GIF URL을 사용합니다. Balanced는 더 가벼운 preview를 사용합니다."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "GIF 즉시 전송", copy: "URL 복사"}, qualityMode: {high: "High quality", balanced: "Balanced"}},
        actions: {show: "보기", hide: "숨기기"}
    },
    bn: {
        headerDescription: "Discord GIF picker-এ আলাদা KLIPY tab যোগ করে। API key, ভাষা, আচরণ এবং media quality এখানে সেট করুন।",
        sections: {language: "ভাষা", access: "KLIPY access", behavior: "Picker behavior", guide: "API key guide"},
        fields: {
            language: ["Settings language", "এই settings panel-এর labels, help text এবং API key guide নিয়ন্ত্রণ করে।"],
            enabled: ["KLIPY tab চালু করুন", "Discord GIF picker-এ আলাদা KLIPY tab দেখান।"],
            apiKey: ["KLIPY API key", "শুধু BetterDiscord local plugin data-তে সংরক্ষিত থাকে। Plugin file-এ bundle হয় না।", "আপনার KLIPY API key paste করুন"],
            resultLimit: ["Result limit", "প্রতি search-এ চাওয়া GIF সংখ্যা। Range: 8-50।"],
            locale: ["Locale", "KLIPY request-এ পাঠানো locale। Example: en-US, bn-BD।"],
            endpointMode: ["Endpoint mode", "Auto আগে KLIPY v1 চেষ্টা করে, দরকার হলে Tenor-compatible v2 fallback করে।"],
            insertMode: ["GIF click action", "Send GIF URL current channel-এ পাঠায়। Copy safe fallback।"],
            qualityMode: ["Media quality", "High preview ও send-এ best GIF URL ব্যবহার করে। Balanced হালকা preview ব্যবহার করে।"]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "GIF এখনই পাঠান", copy: "URL copy করুন"}, qualityMode: {high: "High quality", balanced: "Balanced"}}
    },
    ur: {
        headerDescription: "Discord GIF picker mein alag KLIPY tab jorta hai. API key, zaban, behavior aur media quality yahan set karein.",
        sections: {language: "Zaban", access: "KLIPY access", behavior: "Picker behavior", guide: "API key guide"},
        fields: {
            language: ["Settings language", "Is settings panel ke tamam labels, help text aur API key guide ko control karta hai."],
            enabled: ["KLIPY tab enable karein", "Discord GIF picker ke andar alag KLIPY tab dikhayein."],
            apiKey: ["KLIPY API key", "Sirf BetterDiscord local plugin data mein save hoti hai. Plugin file mein bundle nahi hoti.", "Apni KLIPY API key paste karein"],
            resultLimit: ["Result limit", "Har search mein mangi jane wali GIFs ki tadaad. Range: 8-50."],
            locale: ["Locale", "KLIPY requests ko bheja jane wala locale. Example: en-US, ur-PK."],
            endpointMode: ["Endpoint mode", "Auto pehle KLIPY v1 try karta hai, zarurat par Tenor-compatible v2 fallback karta hai."],
            insertMode: ["GIF click action", "Send GIF URL ko current channel mein bhejta hai. Copy safe fallback hai."],
            qualityMode: ["Media quality", "High preview aur send ke liye best GIF URL use karta hai. Balanced halka preview use karta hai."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "GIF foran bhejein", copy: "URL copy karein"}, qualityMode: {high: "High quality", balanced: "Balanced"}},
        dir: "rtl"
    },
    fa: {
        headerDescription: "یک تب جداگانه KLIPY به GIF picker دیسکورد اضافه می کند. API key، زبان، رفتار و کیفیت media را اینجا تنظیم کنید.",
        sections: {language: "زبان", access: "دسترسی KLIPY", behavior: "رفتار picker", guide: "راهنمای API key"},
        fields: {
            language: ["زبان تنظیمات", "همه label ها، متن های راهنما و راهنمای API key در این پنل را کنترل می کند."],
            enabled: ["فعال کردن تب KLIPY", "یک تب جداگانه KLIPY داخل GIF picker دیسکورد نشان می دهد."],
            apiKey: ["KLIPY API key", "فقط در داده محلی BetterDiscord ذخیره می شود و داخل فایل plugin قرار نمی گیرد.", "KLIPY API key خود را paste کنید"],
            resultLimit: ["محدودیت نتایج", "تعداد GIF در هر جستجو. بازه: 8-50."],
            locale: ["Locale", "Locale ارسال شده به درخواست های KLIPY. مثال: en-US, fa-IR."],
            endpointMode: ["حالت endpoint", "Auto ابتدا KLIPY v1 را امتحان می کند و در صورت نیاز به v2 سازگار با Tenor برمی گردد."],
            insertMode: ["عمل کلیک روی GIF", "Send لینک GIF را به channel فعلی می فرستد. Copy fallback امن است."],
            qualityMode: ["کیفیت media", "High بهترین GIF URL را برای preview و ارسال استفاده می کند. Balanced preview سبک تر استفاده می کند."]
        },
        options: {endpointMode: {auto: "Auto", v1: "KLIPY v1", v2: "Tenor-compatible v2"}, insertMode: {send: "ارسال فوری GIF", copy: "کپی URL"}, qualityMode: {high: "کیفیت بالا", balanced: "متعادل"}},
        actions: {show: "نمایش", hide: "مخفی"},
        dir: "rtl"
    }
});

const UPDATE_SETTING_COPY = Object.freeze({
    en: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Check for updates", "Checks the GitHub raw plugin file on startup and shows an update button when a newer version is available."]}
    },
    tr: {
        sections: {updates: "Güncellemeler"},
        fields: {checkForUpdates: ["Güncellemeleri kontrol et", "Başlangıçta GitHub raw plugin dosyasını kontrol eder ve daha yeni sürüm varsa güncelleme butonu gösterir."]}
    },
    zh: {
        sections: {updates: "更新"},
        fields: {checkForUpdates: ["检查更新", "启动时检查 GitHub raw 插件文件，如果有新版本则显示更新按钮。"]}
    },
    hi: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Updates check karein", "Startup par GitHub raw plugin file check karta hai aur naya version ho to update button dikhata hai."]}
    },
    es: {
        sections: {updates: "Actualizaciones"},
        fields: {checkForUpdates: ["Buscar actualizaciones", "Comprueba el archivo raw del plugin en GitHub al iniciar y muestra un boton si hay una version nueva."]}
    },
    ar: {
        sections: {updates: "التحديثات"},
        fields: {checkForUpdates: ["التحقق من التحديثات", "يتحقق من ملف الإضافة الخام على GitHub عند البدء ويعرض زر تحديث عند توفر إصدار أحدث."]}
    },
    fr: {
        sections: {updates: "Mises a jour"},
        fields: {checkForUpdates: ["Verifier les mises a jour", "Verifie le fichier raw du plugin sur GitHub au demarrage et affiche un bouton si une nouvelle version existe."]}
    },
    de: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Nach Updates suchen", "Prueft beim Start die Raw-Plugin-Datei auf GitHub und zeigt bei einer neueren Version einen Update-Button."]}
    },
    pt: {
        sections: {updates: "Atualizacoes"},
        fields: {checkForUpdates: ["Verificar atualizacoes", "Verifica o arquivo raw do plugin no GitHub ao iniciar e mostra um botao quando ha uma versao nova."]}
    },
    it: {
        sections: {updates: "Aggiornamenti"},
        fields: {checkForUpdates: ["Controlla aggiornamenti", "Controlla il file raw del plugin su GitHub all'avvio e mostra un pulsante se esiste una nuova versione."]}
    },
    id: {
        sections: {updates: "Pembaruan"},
        fields: {checkForUpdates: ["Periksa pembaruan", "Memeriksa file raw plugin di GitHub saat mulai dan menampilkan tombol update jika ada versi baru."]}
    },
    vi: {
        sections: {updates: "Cap nhat"},
        fields: {checkForUpdates: ["Kiem tra cap nhat", "Kiem tra file raw plugin tren GitHub khi khoi dong va hien nut cap nhat neu co ban moi."]}
    },
    sw: {
        sections: {updates: "Masasisho"},
        fields: {checkForUpdates: ["Angalia masasisho", "Hukagua faili raw ya plugin kwenye GitHub wakati wa kuanza na huonyesha kitufe cha kusasisha ikiwa kuna toleo jipya."]}
    },
    fil: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Tingnan ang updates", "Tinitingnan ang GitHub raw plugin file sa startup at nagpapakita ng update button kapag may mas bagong version."]}
    },
    ru: {
        sections: {updates: "Обновления"},
        fields: {checkForUpdates: ["Проверять обновления", "При запуске проверяет raw-файл плагина на GitHub и показывает кнопку обновления, если доступна новая версия."]}
    },
    ja: {
        sections: {updates: "更新"},
        fields: {checkForUpdates: ["更新を確認", "起動時に GitHub raw plugin file を確認し、新しい version がある場合は update button を表示します。"]}
    },
    ko: {
        sections: {updates: "업데이트"},
        fields: {checkForUpdates: ["업데이트 확인", "시작 시 GitHub raw plugin file을 확인하고 새 version이 있으면 update button을 표시합니다."]}
    },
    bn: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Update check করুন", "Startup-এ GitHub raw plugin file check করে এবং নতুন version থাকলে update button দেখায়।"]}
    },
    ur: {
        sections: {updates: "Updates"},
        fields: {checkForUpdates: ["Updates check karein", "Startup par GitHub raw plugin file check karta hai aur naya version ho to update button dikhata hai."]}
    },
    fa: {
        sections: {updates: "به روزرسانی ها"},
        fields: {checkForUpdates: ["بررسی به روزرسانی", "هنگام شروع فایل raw پلاگین در GitHub را بررسی می کند و اگر نسخه جدید باشد دکمه update نشان می دهد."]}
    }
});

module.exports = class GifSourcePlus {
    constructor() {
        this.settings = {...DEFAULT_SETTINGS};
        this.observer = null;
        this.mounted = new Map();
        this.moduleCache = new Map();
        this.fluxSubscriptions = [];
        this.injectTimer = null;
        this.updateCheckTimer = null;
        this.styleId = "gsp-klipy-styles";
        this.boundTryInject = this.tryInject.bind(this);
        this.boundScheduleInject = this.scheduleInject.bind(this);
        this.boundShortcutKeyDown = this.handleShortcutKeyDown.bind(this);
    }

    start() {
        this.settings = this.loadSettings();
        this.injectStyles();
        this.startObserver();
        this.startFluxSubscriptions();
        document.addEventListener("keydown", this.boundShortcutKeyDown, true);
        this.scheduleInject();
        this.scheduleUpdateCheck();
        this.toast("GifSourcePlus enabled.", "info");
    }

    stop() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.injectTimer) {
            clearTimeout(this.injectTimer);
            this.injectTimer = null;
        }

        if (this.updateCheckTimer) {
            clearTimeout(this.updateCheckTimer);
            this.updateCheckTimer = null;
        }

        this.stopFluxSubscriptions();
        for (const mount of this.mounted.values()) {
            this.unmountPicker(mount);
        }
        this.mounted.clear();
        this.moduleCache.clear();
        document.removeEventListener("keydown", this.boundShortcutKeyDown, true);
        BdApi.DOM.removeStyle(this.styleId);
    }

    getSettingsPanel() {
        this.settings = this.loadSettings();
        const copy = this.getSettingsCopy();

        const panel = document.createElement("div");
        panel.className = "gsp-settings";
        panel.dir = copy.dir || "ltr";
        const rerender = () => panel.replaceWith(this.getSettingsPanel());
        panel.append(
            this.createSettingsHeader(copy),
            this.createSettingsSection(copy.sections.language, [
                this.createLanguageSetting(copy, rerender)
            ]),
            this.createSettingsSection(copy.sections.access, [
                this.createToggleSetting(copy.fields.enabled, "enabled"),
                this.createPasswordSetting(copy),
                this.createApiKeyGuide(copy)
            ]),
            this.createSettingsSection(copy.sections.behavior, [
                this.createNumberSetting(copy.fields.resultLimit, "resultLimit", 8, 50),
                this.createTextSetting(copy.fields.locale, "locale"),
                this.createSelectSetting(copy.fields.endpointMode, "endpointMode", this.getTranslatedOptions(copy, "endpointMode", ["auto", "v1", "v2"])),
                this.createSelectSetting(copy.fields.insertMode, "insertMode", this.getTranslatedOptions(copy, "insertMode", ["send", "copy"])),
                this.createSelectSetting(copy.fields.qualityMode, "qualityMode", this.getTranslatedOptions(copy, "qualityMode", ["high", "balanced"])),
                this.createToggleSetting(copy.fields.shortcutEnabled, "shortcutEnabled")
            ]),
            this.createSettingsSection(copy.sections.updates, [
                this.createToggleSetting(copy.fields.checkForUpdates, "checkForUpdates")
            ]),
            this.createSettingsFooter(copy)
        );

        return panel;
    }

    loadSettings() {
        const saved = BdApi.Data.load(PLUGIN_NAME, "settings");
        const merged = {...DEFAULT_SETTINGS, ...(saved && typeof saved === "object" ? saved : {})};
        merged.resultLimit = this.clampNumber(merged.resultLimit, 8, 50, DEFAULT_SETTINGS.resultLimit);
        merged.locale = typeof merged.locale === "string" && merged.locale.trim() ? merged.locale.trim() : DEFAULT_SETTINGS.locale;
        merged.guideLanguage = API_KEY_GUIDES[merged.guideLanguage] ? merged.guideLanguage : DEFAULT_SETTINGS.guideLanguage;
        merged.endpointMode = ["auto", "v1", "v2"].includes(merged.endpointMode) ? merged.endpointMode : DEFAULT_SETTINGS.endpointMode;
        if (merged.insertMode === "insert") merged.insertMode = "send";
        merged.insertMode = ["send", "copy"].includes(merged.insertMode) ? merged.insertMode : DEFAULT_SETTINGS.insertMode;
        merged.qualityMode = ["high", "balanced"].includes(merged.qualityMode) ? merged.qualityMode : DEFAULT_SETTINGS.qualityMode;
        merged.shortcutEnabled = merged.shortcutEnabled !== false;
        merged.checkForUpdates = merged.checkForUpdates !== false;
        merged.apiKey = typeof merged.apiKey === "string" ? merged.apiKey.trim() : "";
        merged.enabled = Boolean(merged.enabled);
        return merged;
    }

    saveSettings() {
        BdApi.Data.save(PLUGIN_NAME, "settings", this.settings);
        if (!this.settings.enabled) {
            for (const mount of this.mounted.values()) {
                this.unmountPicker(mount);
            }
            this.mounted.clear();
            return;
        }

        this.scheduleInject();
    }

    scheduleUpdateCheck() {
        if (!this.settings.checkForUpdates) return;
        if (this.updateCheckTimer) clearTimeout(this.updateCheckTimer);
        this.updateCheckTimer = setTimeout(() => {
            this.updateCheckTimer = null;
            this.checkForUpdate();
        }, UPDATE_CHECK_DELAY_MS);
    }

    async checkForUpdate() {
        try {
            const remoteFile = await this.fetchUpdateFile();
            const remoteMeta = this.parsePluginMeta(remoteFile);
            this.validateUpdateFile(remoteMeta, remoteFile);

            if (!this.isRemoteVersionNewer(remoteMeta.version, config.info.version)) return false;
            this.showUpdateNotification(remoteMeta, remoteFile);
            return true;
        } catch (error) {
            console.warn(`[${PLUGIN_NAME}] Failed to check for updates.`, error);
            return false;
        }
    }

    async fetchUpdateFile() {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), UPDATE_CHECK_TIMEOUT_MS);

        try {
            const response = BdApi.Net && typeof BdApi.Net.fetch === "function"
                ? await BdApi.Net.fetch(UPDATE_URL, {
                    method: "GET",
                    signal: controller.signal,
                    headers: {"Accept": "text/plain"}
                })
                : await fetch(UPDATE_URL, {
                    method: "GET",
                    signal: controller.signal,
                    headers: {"Accept": "text/plain"}
                });

            if (!response || !response.ok) {
                throw new Error(`Update request failed with status ${response?.status || "unknown"}.`);
            }

            return response.text();
        } finally {
            clearTimeout(timeout);
        }
    }

    parsePluginMeta(fileContent) {
        const match = String(fileContent || "").match(/^\s*\/\*\*([\s\S]*?)\*\//);
        if (!match) throw new Error("Remote plugin metadata block is missing.");

        const meta = {};
        for (const rawLine of match[1].split(/\r?\n/)) {
            const line = rawLine.replace(/^\s*\*\s?/, "").trim();
            const field = line.match(/^@(\w+)\s+(.+)$/);
            if (field) meta[field[1]] = field[2].trim();
        }

        return meta;
    }

    validateUpdateFile(remoteMeta, remoteFile) {
        if (remoteMeta.name !== PLUGIN_NAME) throw new Error(`Unexpected update name: ${remoteMeta.name || "missing"}.`);
        if (!remoteMeta.version) throw new Error("Remote update version is missing.");
        if (!String(remoteFile).includes("module.exports = class GifSourcePlus")) {
            throw new Error("Remote update file does not look like GifSourcePlus.");
        }
    }

    isRemoteVersionNewer(remoteVersion, currentVersion) {
        const remote = this.parseSemver(remoteVersion);
        const current = this.parseSemver(currentVersion);
        if (!remote || !current) return false;

        for (let index = 0; index < 3; index += 1) {
            if (remote[index] > current[index]) return true;
            if (remote[index] < current[index]) return false;
        }

        return false;
    }

    parseSemver(version) {
        const match = String(version || "").trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
        if (!match) return null;
        return match.slice(1, 4).map((part) => Number.parseInt(part, 10));
    }

    showUpdateNotification(remoteMeta, remoteFile) {
        const title = `${PLUGIN_NAME} update available`;
        const content = `Version ${remoteMeta.version} is available. Current version: ${config.info.version}.`;
        const update = async () => {
            try {
                await this.installUpdate(remoteFile);
                this.toast(`${PLUGIN_NAME} updated to ${remoteMeta.version}. Reload or restart Discord if it does not reload automatically.`, "success");
            } catch (error) {
                console.error(`[${PLUGIN_NAME}] Failed to install update.`, error);
                this.toast("Could not install the update. Download the latest plugin file manually.", "error");
            }
        };

        if (BdApi.UI && typeof BdApi.UI.showNotification === "function") {
            BdApi.UI.showNotification({
                title,
                content,
                actions: [{label: "Update", onClick: update}]
            });
            return;
        }

        if (BdApi.UI && typeof BdApi.UI.showConfirmationModal === "function") {
            BdApi.UI.showConfirmationModal(title, content, {
                confirmText: "Update",
                cancelText: "Later",
                onConfirm: update
            });
            return;
        }

        this.toast(`${title}: ${remoteMeta.version}`, "info");
    }

    async installUpdate(remoteFile) {
        const filePath = this.getPluginFilePath();
        await fs.promises.writeFile(filePath, remoteFile, "utf8");
    }

    getPluginFilePath() {
        if (typeof __filename === "string" && path.basename(__filename).toLowerCase().endsWith(".plugin.js")) {
            return __filename;
        }

        const pluginsFolder = BdApi.Plugins && BdApi.Plugins.folder;
        if (!pluginsFolder) throw new Error("BetterDiscord plugins folder is unavailable.");
        return path.join(pluginsFolder, `${PLUGIN_NAME}.plugin.js`);
    }

    injectStyles() {
        BdApi.DOM.addStyle(this.styleId, `
.gsp-klipy-tab {
    align-items: center !important;
    align-self: center !important;
    background: transparent !important;
    border: 0 !important;
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--interactive-normal, #b5bac1) !important;
    cursor: pointer;
    display: inline-flex !important;
    flex: 0 0 auto !important;
    font: inherit !important;
    font-weight: 600;
    gap: 6px;
    height: 32px !important;
    justify-content: center !important;
    line-height: 16px !important;
    margin: 0 1px;
    max-height: none !important;
    min-height: 32px !important;
    min-width: 0 !important;
    overflow: visible !important;
    padding: 0 10px !important;
    position: relative;
    text-indent: 0 !important;
    transform: none !important;
    white-space: nowrap;
    z-index: 80;
}
.gsp-klipy-mount [role="tablist"],
.gsp-klipy-mount [class*="nav_"] {
    position: relative;
    z-index: 90;
}
.gsp-klipy-tab[role="tab"] {
    outline: none;
}
.gsp-klipy-tab-label {
    display: block !important;
    flex: 0 0 auto !important;
    font: inherit !important;
    line-height: 16px !important;
    margin: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
    text-indent: 0 !important;
    transform: none !important;
}
.gsp-klipy-tab:hover,
.gsp-klipy-tab.gsp-active {
    background: var(--background-modifier-hover, rgba(255,255,255,.08)) !important;
    color: var(--interactive-active, #fff) !important;
}
.gsp-klipy-tab-host {
    align-items: center;
    border-bottom: 1px solid var(--background-modifier-accent, rgba(255,255,255,.08));
    display: flex;
    gap: 8px;
    min-height: 44px;
    padding: 6px 12px;
}
.gsp-klipy-mount {
    position: relative !important;
}
.gsp-klipy-hidden {
    display: none !important;
}
.gsp-klipy-mount.gsp-klipy-open > [role="tabpanel"]:not(#gif-source-plus-klipy-panel) {
    display: none !important;
}
.gsp-klipy-panel {
    background: var(--background-base-lowest, var(--background-secondary-alt));
    bottom: 0;
    box-sizing: border-box;
    color: var(--text-normal, #dbdee1);
    display: none;
    flex-direction: column;
    gap: 0;
    left: 0;
    min-height: 320px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    right: 0;
    top: var(--gsp-klipy-panel-top, 56px);
    z-index: 40;
}
.gsp-klipy-mount.gsp-klipy-open .gsp-klipy-panel {
    display: flex;
}
.gsp-klipy-toolbar {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    gap: 10px;
    padding: 10px 12px 12px;
}
.gsp-klipy-content {
    display: block;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
}
.gsp-klipy-search-shell {
    align-items: center;
    background: var(--input-background, var(--background-base-low, #1e1f22));
    border: 1px solid var(--border-subtle, var(--background-modifier-accent, rgba(255,255,255,.12)));
    border-radius: 4px;
    box-sizing: border-box;
    color: var(--text-muted, #949ba4);
    display: flex;
    flex: 1;
    gap: 8px;
    height: 38px;
    min-width: 0;
    padding: 0 10px;
}
.gsp-klipy-search-shell:focus-within {
    border-color: var(--brand-500, #5865f2);
}
.gsp-klipy-search-icon {
    color: var(--icon-muted, var(--text-muted, #949ba4));
    flex: 0 0 auto;
    height: 16px;
    width: 16px;
}
.gsp-klipy-search {
    background: var(--input-background, var(--background-base-low, #1e1f22));
    border: 0;
    box-sizing: border-box;
    color: var(--text-normal, #dbdee1);
    flex: 1;
    font: inherit;
    height: 34px;
    min-width: 0;
    outline: none;
    padding: 0;
}
.gsp-klipy-search::placeholder {
    color: var(--text-muted, #949ba4);
}
.gsp-klipy-clear {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--interactive-normal, #b5bac1);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    height: 24px;
    justify-content: center;
    padding: 0;
    width: 24px;
}
.gsp-klipy-clear:hover {
    color: var(--interactive-active, #fff);
}
.gsp-klipy-button {
    background: var(--button-secondary-background, var(--background-modifier-selected, #4e5058));
    border: 0;
    border-radius: 4px;
    color: var(--button-secondary-text, #fff);
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    height: 38px;
    padding: 0 14px;
}
.gsp-klipy-button:hover {
    background: var(--button-secondary-background-hover, #5c5f66);
}
.gsp-klipy-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    height: 100%;
    overflow-y: auto;
    padding: 0 12px 12px;
    scrollbar-color: var(--scrollbar-thin-thumb, rgba(255,255,255,.25)) transparent;
}
.gsp-klipy-grid[hidden],
.gsp-klipy-state[hidden],
.gsp-klipy-clear[hidden] {
    display: none !important;
}
.gsp-klipy-card {
    background: var(--background-base-low, var(--background-primary, #1e1f22));
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    height: 112px;
    overflow: hidden;
    padding: 0;
    position: relative;
}
.gsp-klipy-card:hover {
    outline: 2px solid var(--brand-500, #5865f2);
}
.gsp-klipy-card img {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
}
.gsp-klipy-badge {
    background: rgba(0,0,0,.64);
    border-radius: 3px;
    bottom: 5px;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    left: 5px;
    line-height: 1;
    padding: 4px 5px;
    position: absolute;
}
.gsp-klipy-state {
    align-items: center;
    color: var(--text-muted, #949ba4);
    display: flex;
    height: 100%;
    justify-content: center;
    min-height: 160px;
    padding: 12px;
    text-align: center;
}
.gsp-klipy-footer {
    align-items: center;
    color: var(--text-muted, #949ba4);
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    min-height: 20px;
    padding: 0 12px 10px;
}
.gsp-settings {
    color: var(--text-normal, #dbdee1);
    display: grid;
    gap: 14px;
    max-width: 820px;
    padding: 18px;
}
.gsp-settings h2 {
    font-size: 22px;
    letter-spacing: 0;
    margin: 0 0 2px;
}
.gsp-settings-header {
    border-bottom: 1px solid var(--background-modifier-accent, rgba(255,255,255,.12));
    display: grid;
    gap: 4px;
    padding-bottom: 14px;
}
.gsp-settings p {
    color: var(--text-muted, #949ba4);
    margin: 0;
}
.gsp-settings-section {
    background: var(--background-secondary, var(--background-secondary-alt, #2b2d31));
    border: 1px solid var(--background-modifier-accent, rgba(255,255,255,.12));
    border-radius: 8px;
    display: grid;
    gap: 12px;
    padding: 14px;
}
.gsp-settings-section-title {
    color: var(--header-primary, var(--text-normal, #dbdee1));
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0;
    margin: 0;
}
.gsp-settings-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
.gsp-setting {
    background: var(--background-base-low, var(--background-primary, #25272d));
    border: 1px solid var(--background-modifier-accent, rgba(255,255,255,.08));
    border-radius: 6px;
    display: grid;
    gap: 6px;
    padding: 12px;
}
.gsp-setting label {
    font-weight: 600;
}
.gsp-setting input,
.gsp-setting select {
    background: var(--input-background, #1e1f22);
    border: 1px solid var(--background-modifier-accent, rgba(255,255,255,.12));
    border-radius: 5px;
    box-sizing: border-box;
    color: var(--text-normal, #dbdee1);
    min-height: 34px;
    padding: 6px 8px;
    width: 100%;
}
.gsp-setting input:focus,
.gsp-setting select:focus {
    border-color: var(--brand-500, #5865f2);
    outline: none;
}
.gsp-settings-footer {
    font-size: 12px;
    line-height: 1.35;
}
.gsp-inline {
    align-items: center;
    display: flex;
    gap: 8px;
}
.gsp-inline input:not([type="checkbox"]) {
    flex: 1 1 auto;
}
.gsp-inline button {
    flex: 0 0 auto;
}
.gsp-inline input[type="checkbox"] {
    flex: 0 0 auto;
    height: 16px;
    margin: 0;
    min-height: auto;
    width: 16px;
}
.gsp-guide-card {
    background: var(--background-secondary, var(--background-secondary-alt, #2b2d31));
    border: 1px solid var(--background-modifier-accent, rgba(255,255,255,.12));
    border-radius: 8px;
    display: grid;
    gap: 12px;
    grid-column: 1 / -1;
    padding: 14px;
}
.gsp-guide-top {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
}
.gsp-guide-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}
.gsp-guide-language {
    min-width: 190px;
}
.gsp-guide-body {
    display: grid;
    gap: 10px;
}
.gsp-guide-body ol {
    display: grid;
    gap: 7px;
    margin: 0;
    padding-left: 22px;
}
.gsp-guide-body li {
    line-height: 1.35;
}
.gsp-guide-note {
    background: var(--background-primary, #1e1f22);
    border-left: 3px solid var(--brand-500, #5865f2);
    border-radius: 4px;
    color: var(--text-normal, #dbdee1) !important;
    padding: 8px 10px;
}
.gsp-guide-link {
    color: var(--text-link, #00a8fc);
    font-weight: 600;
    text-decoration: none;
}
.gsp-guide-link:hover {
    text-decoration: underline;
}
        `);
    }

    startObserver() {
        this.observer = new MutationObserver(this.boundTryInject);
        this.observer.observe(document.body, {childList: true, subtree: true});
    }

    startFluxSubscriptions() {
        const dispatcher = this.getFluxDispatcher();
        if (!dispatcher || typeof dispatcher.subscribe !== "function") return;

        for (const eventName of [
            "GIF_PICKER_INITIALIZE",
            "GIF_PICKER_QUERY_SUCCESS",
            "GIF_PICKER_TRENDING_FETCH_SUCCESS",
            "LAYER_PUSH",
            "POPOUT_WINDOW_OPEN",
            "CHANNEL_SELECT"
        ]) {
            this.subscribeFluxEvent(dispatcher, eventName, this.boundScheduleInject);
        }
    }

    subscribeFluxEvent(dispatcher, eventName, callback) {
        try {
            dispatcher.subscribe(eventName, callback);
            this.fluxSubscriptions.push({dispatcher, eventName, callback});
        }
        catch (_) {
            // Flux event availability changes between Discord builds; DOM observer remains the fallback.
        }
    }

    stopFluxSubscriptions() {
        for (const {dispatcher, eventName, callback} of this.fluxSubscriptions.splice(0)) {
            try {
                dispatcher.unsubscribe?.(eventName, callback);
            }
            catch (_) {}
        }
    }

    scheduleInject() {
        if (this.injectTimer) clearTimeout(this.injectTimer);
        this.injectTimer = setTimeout(() => {
            this.injectTimer = null;
            this.tryInject();
        }, 100);
    }

    handleShortcutKeyDown(event) {
        if (!this.settings.enabled || !this.settings.shortcutEnabled) return;
        if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
        if ((event.key || "").toLowerCase() !== "g") return;
        if (event.target instanceof Element && event.target.closest(".gsp-settings")) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        this.openKlipyFromShortcut();
    }

    openKlipyFromShortcut() {
        this.tryInject();

        const existing = this.getVisibleMount();
        if (existing) {
            this.openKlipyTab(existing);
            existing.panel.search.focus();
            return;
        }

        const gifButton = this.findGifPickerButton();
        if (gifButton) gifButton.click();

        let opened = false;
        const tryOpen = () => {
            if (opened) return;
            this.tryInject();
            const mount = this.getVisibleMount();
            if (!mount) return;
            opened = true;
            this.openKlipyTab(mount);
            mount.panel.search.focus();
        };

        for (const delay of [80, 180, 350, 650]) {
            setTimeout(tryOpen, delay);
        }
    }

    getVisibleMount() {
        return Array.from(this.mounted.values())
            .find((mount) => mount.container.isConnected && this.isVisible(mount.container));
    }

    findGifPickerButton() {
        for (const root of this.getComposerRoots()) {
            const candidates = Array.from(root.querySelectorAll("button,[role='button']"));
            const button = candidates.find((candidate) => this.isLikelyGifPickerButton(candidate));
            if (button) return button;
        }

        return null;
    }

    getComposerRoots() {
        const roots = new Set();
        const activeRoot = document.activeElement instanceof Element
            ? document.activeElement.closest("form,[class*='channelTextArea']")
            : null;
        if (activeRoot instanceof HTMLElement) roots.add(activeRoot);

        for (const root of document.querySelectorAll("form,[class*='channelTextArea']")) {
            if (root instanceof HTMLElement) roots.add(root);
        }

        return Array.from(roots).filter((root) => {
            if (!this.isVisibleComposerRoot(root)) return false;
            if (root.closest(".gsp-klipy-panel") || root.closest(".bd-modal-root")) return false;
            return Boolean(root.querySelector("textarea,[contenteditable='true'],[role='textbox']"));
        });
    }

    isVisibleComposerRoot(root) {
        const rect = root.getBoundingClientRect();
        return rect.width >= 240 && rect.height >= 32;
    }

    isLikelyGifPickerButton(candidate) {
        if (!(candidate instanceof HTMLElement) || !this.isVisibleButton(candidate)) return false;
        if (candidate.closest("[class*='message'],[class*='embed'],[class*='media'],[class*='imageWrapper']")) return false;
        if (candidate.hasAttribute("disabled") || candidate.getAttribute("aria-disabled") === "true") return false;

        const label = [
            candidate.getAttribute("aria-label"),
            candidate.getAttribute("title"),
            candidate.textContent
        ].filter(Boolean).join(" ");

        return /\bgifs?\b/i.test(label);
    }

    isVisibleButton(node) {
        const rect = node.getBoundingClientRect();
        return rect.width >= 16 && rect.height >= 16 && rect.width <= 64 && rect.height <= 64;
    }

    tryInject() {
        if (!this.settings.enabled) return;

        this.syncMountedPickers();

        for (const candidate of this.findGifPickerCandidates()) {
            if (this.mounted.has(candidate) || candidate.querySelector(".gsp-klipy-panel")) continue;
            if (candidate.closest(".gsp-klipy-mount")) continue;
            this.mountPicker(candidate);
        }
    }

    syncMountedPickers() {
        for (const [container, mount] of Array.from(this.mounted.entries())) {
            if (!container.isConnected) {
                this.unmountPicker(mount);
                this.mounted.delete(container);
                continue;
            }

            if (!container.classList.contains("gsp-klipy-open") || !mount.tabList) continue;

            const nativeSelected = Array.from(mount.tabList.querySelectorAll("[role='tab']"))
                .some((tab) => tab !== mount.tab && (tab.getAttribute("aria-selected") === "true" || tab.getAttribute("aria-current") === "page"));

            if (nativeSelected) this.closeKlipyTab(mount, {restoreNative: false});
        }
    }

    findGifPickerCandidates() {
        const candidates = new Set();

        for (const panel of document.querySelectorAll("#gif-picker-tab-panel")) {
            if (!(panel instanceof HTMLElement)) continue;

            const container = panel.closest("[class*='contentWrapper_']");
            if (!(container instanceof HTMLElement)) continue;
            if (!this.isVisible(container)) continue;
            if (!container.querySelector("[role='tablist']")) continue;
            if (container.closest(".gsp-klipy-panel") || container.closest(".bd-modal-root")) continue;

            candidates.add(container);
        }

        return Array.from(candidates).slice(0, 2);
    }

    mountPicker(container) {
        container.classList.add("gsp-klipy-mount");

        const gifPanel = container.querySelector("#gif-picker-tab-panel");
        const tab = this.createKlipyTab(container);
        const panel = this.createKlipyPanel(gifPanel);
        container.appendChild(panel.root);

        const mount = {
            container,
            tab,
            tabHost: tab.parentElement && tab.parentElement.classList.contains("gsp-klipy-tab-host") ? tab.parentElement : null,
            tabList: container.querySelector("[role='tablist']"),
            gifPanel,
            panel,
            abortController: null,
            debounceTimer: null,
            lastQuery: "",
            lastResults: [],
            onTabListPointerDown: null,
            onTabListClick: null,
            onTabListKeyDown: null,
            nativeTabSnapshots: null
        };

        tab.addEventListener("click", () => this.openKlipyTab(mount));
        tab.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.openKlipyTab(mount);
            }
        });
        if (mount.tabList) {
            const closeFromNativeTab = (event) => {
                if (event.target === tab || tab.contains(event.target)) return;
                const clickedTab = event.target instanceof Element ? event.target.closest("[role='tab']") : null;
                if (clickedTab && mount.tabList.contains(clickedTab)) this.closeKlipyTab(mount, {restoreNative: false});
            };
            mount.onTabListPointerDown = closeFromNativeTab;
            mount.onTabListClick = closeFromNativeTab;
            mount.onTabListKeyDown = (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                closeFromNativeTab(event);
            };
            mount.tabList.addEventListener("pointerdown", mount.onTabListPointerDown, true);
            mount.tabList.addEventListener("click", mount.onTabListClick, true);
            mount.tabList.addEventListener("keydown", mount.onTabListKeyDown, true);
        }
        panel.retry.addEventListener("click", () => this.runSearch(mount, mount.lastQuery));
        panel.search.addEventListener("input", () => {
            panel.clear.hidden = !panel.search.value;
            if (mount.debounceTimer) clearTimeout(mount.debounceTimer);
            mount.debounceTimer = setTimeout(() => this.runSearch(mount, panel.search.value.trim()), 350);
        });
        panel.clear.addEventListener("click", () => {
            panel.search.value = "";
            panel.clear.hidden = true;
            this.runSearch(mount, "");
            panel.search.focus();
        });
        panel.search.addEventListener("keydown", (event) => {
            if (event.key === "Escape") this.closeKlipyTab(mount, {restoreNative: true});
        });

        this.mounted.set(container, mount);
    }

    unmountPicker(mount) {
        if (mount.abortController) mount.abortController.abort();
        if (mount.debounceTimer) clearTimeout(mount.debounceTimer);
        if (mount.tabList && mount.onTabListPointerDown) mount.tabList.removeEventListener("pointerdown", mount.onTabListPointerDown, true);
        if (mount.tabList && mount.onTabListClick) mount.tabList.removeEventListener("click", mount.onTabListClick, true);
        if (mount.tabList && mount.onTabListKeyDown) mount.tabList.removeEventListener("keydown", mount.onTabListKeyDown, true);
        if (mount.gifPanel) mount.gifPanel.classList.remove("gsp-klipy-hidden");
        mount.container.classList.remove("gsp-klipy-mount", "gsp-klipy-open");
        this.restoreNativeTabs(mount);
        mount.tab.remove();
        if (mount.tabHost && !mount.tabHost.childElementCount) mount.tabHost.remove();
        mount.panel.root.remove();
    }

    createKlipyTab(container) {
        const tabList = container.querySelector("[role='tablist']");
        const inactiveTab = tabList && Array.from(tabList.querySelectorAll("[role='tab']")).find((item) => item.getAttribute("aria-selected") === "false");
        const activeTab = tabList && tabList.querySelector("[role='tab'][aria-selected='true']");
        const tab = document.createElement(tabList ? "div" : "button");
        if (!tabList) tab.type = "button";
        tab.className = `${this.inactiveTabClassName(inactiveTab || activeTab)} gsp-klipy-tab`.trim();
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "0");
        tab.id = "gif-source-plus-klipy-tab";
        tab.setAttribute("aria-controls", "gif-source-plus-klipy-panel");
        tab.setAttribute("aria-label", "KLIPY");

        const label = document.createElement("span");
        label.className = "gsp-klipy-tab-label";
        label.textContent = "KLIPY";
        tab.appendChild(label);

        if (tabList) {
            tabList.appendChild(tab);
            return tab;
        }

        const host = document.createElement("div");
        host.className = "gsp-klipy-tab-host";
        host.appendChild(tab);
        container.prepend(host);
        return tab;
    }

    createKlipyPanel(sourcePanel) {
        const root = document.createElement("section");
        root.id = "gif-source-plus-klipy-panel";
        root.className = `${sourcePanel instanceof HTMLElement ? sourcePanel.className : ""} gsp-klipy-panel`.trim();
        root.setAttribute("role", "tabpanel");
        root.setAttribute("aria-labelledby", "gif-source-plus-klipy-tab");
        root.setAttribute("aria-label", "KLIPY GIF picker");

        const toolbar = document.createElement("div");
        const sourceHeader = sourcePanel instanceof HTMLElement ? sourcePanel.querySelector("[class*='header_']") : null;
        toolbar.className = `${sourceHeader instanceof HTMLElement ? sourceHeader.className : ""} gsp-klipy-toolbar`.trim();

        const search = document.createElement("input");
        search.className = "gsp-klipy-search";
        search.type = "search";
        search.placeholder = "Search KLIPY GIFs";
        search.autocomplete = "off";

        const searchShell = document.createElement("div");
        searchShell.className = "gsp-klipy-search-shell";

        const searchIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        searchIcon.classList.add("gsp-klipy-search-icon");
        searchIcon.setAttribute("aria-hidden", "true");
        searchIcon.setAttribute("viewBox", "0 0 24 24");
        const searchPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        searchPath.setAttribute("fill", "currentColor");
        searchPath.setAttribute("fill-rule", "evenodd");
        searchPath.setAttribute("clip-rule", "evenodd");
        searchPath.setAttribute("d", "M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z");
        searchIcon.appendChild(searchPath);

        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "gsp-klipy-clear";
        clear.setAttribute("aria-label", "Clear KLIPY search");
        clear.textContent = "×";
        clear.hidden = true;

        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "gsp-klipy-button";
        retry.textContent = "Retry";

        searchShell.append(searchIcon, search, clear);
        toolbar.append(searchShell, retry);

        const sourceContent = sourcePanel instanceof HTMLElement ? sourcePanel.querySelector("[class*='content_']") : null;
        const content = document.createElement("div");
        content.className = `${sourceContent instanceof HTMLElement ? sourceContent.className : ""} gsp-klipy-content`.trim();

        const state = document.createElement("div");
        state.className = "gsp-klipy-state";
        state.textContent = "Open settings and add your KLIPY API key.";

        const grid = document.createElement("div");
        grid.className = "gsp-klipy-grid";
        grid.hidden = true;
        content.append(state, grid);

        const footer = document.createElement("div");
        footer.className = "gsp-klipy-footer";

        const attribution = document.createElement("span");
        attribution.textContent = "Powered by KLIPY";

        const count = document.createElement("span");
        count.textContent = "";

        footer.append(attribution, count);
        root.append(toolbar, content, footer);

        return {root, search, clear, retry, state, grid, count};
    }

    openKlipyTab(mount) {
        if (!this.settings.enabled) return;
        this.deactivateNativeTabs(mount);
        mount.container.classList.add("gsp-klipy-open");
        mount.tab.classList.add("gsp-active");
        mount.tab.setAttribute("aria-selected", "true");
        mount.tab.setAttribute("aria-current", "page");
        this.syncPanelTop(mount);
        if (mount.gifPanel) mount.gifPanel.classList.add("gsp-klipy-hidden");
        mount.panel.search.focus();

        if (!mount.lastResults.length && !mount.panel.search.value.trim()) {
            this.runSearch(mount, "");
        }
    }

    closeKlipyTab(mount, options = {}) {
        const {restoreNative = false} = options;
        mount.container.classList.remove("gsp-klipy-open");
        mount.tab.classList.remove("gsp-active");
        mount.tab.setAttribute("aria-selected", "false");
        mount.tab.removeAttribute("aria-current");
        if (mount.gifPanel) mount.gifPanel.classList.remove("gsp-klipy-hidden");
        if (restoreNative) this.restoreNativeTabs(mount);
        else mount.nativeTabSnapshots = null;
    }

    syncPanelTop(mount) {
        const nav = mount.container.querySelector("[class*='nav_'], nav");
        const height = nav instanceof HTMLElement ? Math.round(nav.getBoundingClientRect().height) : 44;
        mount.container.style.setProperty("--gsp-klipy-panel-top", `${Math.max(56, height + 12)}px`);
    }

    deactivateNativeTabs(mount) {
        if (!mount.tabList) return;
        const tabs = Array.from(mount.tabList.querySelectorAll("[role='tab']")).filter((item) => item !== mount.tab);

        mount.nativeTabSnapshots = tabs.map((tab) => ({
            tab,
            className: tab.className,
            ariaSelected: tab.getAttribute("aria-selected"),
            ariaCurrent: tab.getAttribute("aria-current"),
            tabIndex: tab.getAttribute("tabindex")
        }));

        for (const tab of tabs) {
            tab.setAttribute("aria-selected", "false");
            tab.removeAttribute("aria-current");
            for (const className of Array.from(tab.classList)) {
                if (/(active|selected|current)/i.test(className)) tab.classList.remove(className);
            }
        }
    }

    restoreNativeTabs(mount) {
        if (!mount.nativeTabSnapshots) return;

        for (const snapshot of mount.nativeTabSnapshots) {
            if (!snapshot.tab || !snapshot.tab.isConnected) continue;
            snapshot.tab.className = snapshot.className;
            this.restoreAttribute(snapshot.tab, "aria-selected", snapshot.ariaSelected);
            this.restoreAttribute(snapshot.tab, "aria-current", snapshot.ariaCurrent);
            this.restoreAttribute(snapshot.tab, "tabindex", snapshot.tabIndex);
        }

        mount.nativeTabSnapshots = null;
    }

    restoreAttribute(node, name, value) {
        if (value === null || value === undefined) node.removeAttribute(name);
        else node.setAttribute(name, value);
    }

    async runSearch(mount, query) {
        mount.lastQuery = query;

        if (!this.settings.apiKey) {
            this.renderState(mount, "Add a KLIPY API key in GifSourcePlus settings before searching.", false);
            return;
        }

        if (mount.abortController) mount.abortController.abort();
        mount.abortController = new AbortController();

        this.renderState(mount, query ? "Searching KLIPY..." : "Loading KLIPY trending GIFs...", true);

        try {
            const data = await this.fetchKlipy(query, mount.abortController.signal);
            const results = this.normalizeResults(data);
            mount.lastResults = results;
            this.renderResults(mount, results);
        }
        catch (error) {
            if (error && error.name === "AbortError") return;
            this.renderState(mount, this.formatError(error), false);
        }
    }

    async fetchKlipy(query, signal) {
        const modes = this.settings.endpointMode === "auto" ? ["v1", "v2"] : [this.settings.endpointMode];
        let lastError = null;

        for (const mode of modes) {
            try {
                const response = await BdApi.Net.fetch(this.buildKlipyUrl(mode, query), {
                    method: "GET",
                    signal,
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    const error = new Error(`KLIPY returned HTTP ${response.status}.`);
                    error.status = response.status;
                    throw error;
                }

                return await response.json();
            }
            catch (error) {
                lastError = error;
                if (signal && signal.aborted) throw error;
                if (this.settings.endpointMode !== "auto") throw error;
                if (!error || ![404, 405].includes(error.status)) throw error;
            }
        }

        throw lastError || new Error("KLIPY request failed.");
    }

    buildKlipyUrl(mode, query) {
        const url = mode === "v2"
            ? new URL(query ? "/v2/search" : "/v2/featured", KLIPY_BASE)
            : new URL(`/api/v1/${encodeURIComponent(this.settings.apiKey)}/gifs/${query ? "search" : "trending"}`, KLIPY_BASE);

        if (mode === "v2") {
            url.searchParams.set("key", this.settings.apiKey);
            url.searchParams.set("limit", String(this.settings.resultLimit));
        }
        else {
            url.searchParams.set("per_page", String(this.settings.resultLimit));
            url.searchParams.set("page", "1");
        }

        if (query) url.searchParams.set("q", query);
        url.searchParams.set("locale", this.settings.locale || DEFAULT_SETTINGS.locale);
        return url.toString();
    }

    normalizeResults(payload) {
        const items = this.extractResultArray(payload);
        const normalized = [];

        for (const item of items) {
            const mediaUrl = this.extractMediaUrl(item, false);
            const lightPreviewUrl = this.extractMediaUrl(item, true) || mediaUrl;
            const previewUrl = this.settings.qualityMode === "high" ? mediaUrl : lightPreviewUrl;
            if (!mediaUrl || !previewUrl) continue;

            normalized.push({
                id: String(item.id || item.slug || item.url || mediaUrl),
                title: item.title || item.name || item.content_description || "KLIPY GIF",
                mediaUrl,
                previewUrl,
                width: Number(item.width || item.w || 0),
                height: Number(item.height || item.h || 0)
            });
        }

        return normalized;
    }

    extractResultArray(payload) {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== "object") return [];

        const paths = [
            ["data"],
            ["results"],
            ["result"],
            ["items"],
            ["gifs"],
            ["media"],
            ["data", "data"],
            ["data", "results"],
            ["data", "gifs"]
        ];

        for (const path of paths) {
            let value = payload;
            for (const key of path) value = value && value[key];
            if (Array.isArray(value)) return value;
        }

        return [];
    }

    extractMediaUrl(item, preview) {
        if (!item || typeof item !== "object") return "";

        const media = item.file || item.files || item.media_formats || item.media || item.images || item.assets || item.renditions;
        const preferredKeys = preview
            ? ["xs", "sm", "md", "nanogif", "tinygif", "gifpreview", "preview", "thumbnail", "gif", "mediumgif", "hd"]
            : ["hd", "gif", "mediumgif", "md", "webp", "mp4", "url", "sm", "tinygif", "nanogif"];

        if (!preview) {
            const nested = this.urlFromMediaMap(media, preferredKeys);
            if (nested) return nested;
        }

        const directKeys = preview
            ? ["preview_url", "previewUrl", "nanogif", "tinygif", "thumbnail", "thumbnail_url", "thumbnailUrl", "gif_url", "gifUrl", "url"]
            : ["hd", "gif", "gif_url", "gifUrl", "media_url", "mediaUrl", "content_url", "contentUrl", "url", "share_url", "shareUrl"];

        for (const key of directKeys) {
            const value = this.urlFromValue(item[key]);
            if (value) return value;
        }

        if (preview) {
            const nested = this.urlFromMediaMap(media, preferredKeys);
            if (nested) return nested;
        }

        for (const value of Object.values(item)) {
            const found = this.urlFromValue(value);
            if (found && /\.(gif|webp|mp4|jpg|jpeg|png)(\?|$)/i.test(found)) return found;
        }

        return "";
    }

    urlFromMediaMap(media, preferredKeys) {
        if (!media || typeof media !== "object") return "";

        for (const key of preferredKeys) {
            const found = this.urlFromValue(media[key]);
            if (found) return found;
        }

        for (const value of Object.values(media)) {
            const found = this.urlFromValue(value);
            if (found) return found;
        }

        return "";
    }

    urlFromValue(value) {
        if (!value) return "";
        if (typeof value === "string") return this.normalizeUrl(value);
        if (typeof value !== "object") return "";

        for (const key of ["hd", "gif", "url", "src", "mp4", "webp", "jpg", "jpeg", "png", "preview", "thumbnail"]) {
            const nested = value[key];
            const url = this.urlFromValue(nested);
            if (url) return url;
        }

        return "";
    }

    normalizeUrl(value) {
        if (!value) return "";
        if (/^\/\//.test(value)) return `https:${value}`;
        if (/^https?:\/\//i.test(value)) return value;
        return "";
    }

    renderResults(mount, results) {
        mount.panel.grid.replaceChildren();
        mount.panel.grid.hidden = !results.length;
        mount.panel.state.hidden = Boolean(results.length);
        mount.panel.count.textContent = results.length ? `${results.length} GIFs` : "";

        if (!results.length) {
            this.renderState(mount, "No KLIPY GIFs found.", false);
            return;
        }

        for (const result of results) {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "gsp-klipy-card";
            card.title = result.title;
            card.setAttribute("aria-label", `Send ${result.title}`);

            const image = document.createElement("img");
            image.src = result.previewUrl;
            image.alt = result.title;
            image.loading = "lazy";

            const badge = document.createElement("span");
            badge.className = "gsp-klipy-badge";
            badge.textContent = "KLIPY";

            card.append(image, badge);
            card.addEventListener("click", () => this.handleGifClick(result.mediaUrl, mount));
            mount.panel.grid.appendChild(card);
        }
    }

    renderState(mount, message, loading) {
        mount.panel.grid.hidden = true;
        mount.panel.state.hidden = false;
        mount.panel.state.textContent = message;
        mount.panel.count.textContent = loading ? "" : "Powered by KLIPY";
    }

    inactiveTabClassName(tab) {
        if (!(tab instanceof HTMLElement)) return "";

        return Array.from(tab.classList)
            .filter((name) => !/(active|selected|current)/i.test(name))
            .join(" ");
    }

    async handleGifClick(url, mount) {
        if (!url) return;

        if (this.settings.insertMode === "copy") {
            await this.copyToClipboard(url);
            return;
        }

        if (await this.sendGifToCurrentChannel(url)) {
            this.closePickerAfterSend(mount);
            this.toast("KLIPY GIF sent.", "success");
            return;
        }

        const copied = await this.copyToClipboard(url, {silent: true});
        this.toast(
            copied ? "Could not send the GIF. GIF URL copied instead." : "Could not send or copy the GIF URL.",
            copied ? "warning" : "error"
        );
    }

    async sendGifToCurrentChannel(url) {
        try {
            const channelId = this.getCurrentChannelId();
            const messageActions = this.getMessageActions();
            if (!channelId || !messageActions || typeof messageActions.sendMessage !== "function") return false;

            const message = this.createMessagePayload(url);
            const sent = this.isYabdp4NitroEnabled() && typeof messageActions._sendMessage === "function"
                ? await this.invokeYabdpCompatibleSend(messageActions, channelId, message)
                : await this.invokeSendMessage(messageActions, channelId, message);
            if (!sent) return false;

            return await this.confirmMessageSent(channelId, message);
        }
        catch (error) {
            console.error(`[${PLUGIN_NAME}] Failed to send KLIPY GIF.`, error);
            return false;
        }
    }

    async invokeSendMessage(messageActions, channelId, message) {
        const nonceOptions = {nonce: message.nonce};
        const attempts = this.buildSendMessageAttempts(messageActions, channelId, message, nonceOptions);
        let lastError = null;

        for (const attempt of attempts) {
            try {
                const result = attempt();
                if (result && typeof result.then === "function") await result;
                return true;
            }
            catch (error) {
                lastError = error;
                if (!this.isNonceSendError(error)) throw error;
            }
        }

        throw lastError;
    }

    async invokeYabdpCompatibleSend(messageActions, channelId, message) {
        const directSendMessage = messageActions._sendMessage.bind(messageActions);
        const options = {
            nonce: message.nonce,
            // YABDP4Nitro treats any defined activityAction as a native Discord action and passes it through untouched.
            activityAction: null
        };
        const result = directSendMessage(channelId, message, options);
        if (result && typeof result.then === "function") await result;
        return true;
    }

    buildSendMessageAttempts(messageActions, channelId, message, options) {
        const sendMessage = messageActions.sendMessage.bind(messageActions);
        const directSendMessage = typeof messageActions._sendMessage === "function"
            ? messageActions._sendMessage.bind(messageActions)
            : null;
        const usesFourthArgumentOptions = this.sendMessageUsesFourthArgumentOptions(messageActions.sendMessage);
        const modernAttempts = [
            () => sendMessage(channelId, message, true, options),
            () => sendMessage(channelId, message, false, options)
        ];
        const legacyAttempts = [
            () => sendMessage(channelId, message, options)
        ];
        const attempts = usesFourthArgumentOptions
            ? modernAttempts.concat(legacyAttempts)
            : legacyAttempts.concat(modernAttempts);

        if (directSendMessage) attempts.push(() => directSendMessage(channelId, message, options));
        return attempts;
    }

    sendMessageUsesFourthArgumentOptions(sendMessage) {
        const source = Function.prototype.toString.call(sendMessage);
        return /arguments\.length\s*>\s*3|\.nonce\s*\?\?|\bnonce\s*:\s*/.test(source);
    }

    isNonceSendError(error) {
        return /nonce|Cannot read properties of undefined/i.test(error?.message || "");
    }

    async confirmMessageSent(channelId, message) {
        const messageStore = this.getMessageStore();
        if (!messageStore) return true;

        for (let attempt = 0; attempt < 24; attempt += 1) {
            const found = this.hasMessageWithNonce(messageStore, channelId, message.nonce);
            if (found === null) return true;
            if (found) return true;
            await this.delay(125);
        }

        return false;
    }

    createMessagePayload(content) {
        return {
            content,
            nonce: this.createNonce(),
            tts: false,
            invalidEmojis: [],
            validNonShortcutEmojis: []
        };
    }

    createNonce() {
        return `${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    }

    getCurrentChannelId() {
        const selectedChannelStore = this.getSelectedChannelStore();
        return selectedChannelStore?.getChannelId?.()
            || selectedChannelStore?.getCurrentlySelectedChannelId?.()
            || selectedChannelStore?.getLastSelectedChannelId?.()
            || this.getChannelIdFromLocation();
    }

    getSelectedChannelStore() {
        return this.getCachedModule("SelectedChannelStore", () => {
            if (!BdApi.Webpack) return null;
            if (typeof BdApi.Webpack.getStore === "function") {
                const store = BdApi.Webpack.getStore("SelectedChannelStore");
                if (store) return store;
            }
            if (BdApi.Webpack.Stores?.SelectedChannelStore) return BdApi.Webpack.Stores.SelectedChannelStore;
            if (typeof BdApi.Webpack.getByKeys === "function") {
                const store = BdApi.Webpack.getByKeys("getChannelId", "getVoiceChannelId");
                if (store) return store;
            }
            if (typeof BdApi.Webpack.getModule === "function") {
                return BdApi.Webpack.getModule((module) => module?.getChannelId && module?.getVoiceChannelId);
            }
            return null;
        }, (store) => typeof store?.getChannelId === "function" || typeof store?.getCurrentlySelectedChannelId === "function");
    }

    getMessageActions() {
        return this.getCachedModule("MessageActions", () => {
            if (!BdApi.Webpack) return null;
            if (typeof BdApi.Webpack.getByKeys === "function") {
                return BdApi.Webpack.getByKeys("sendMessage", "editMessage")
                    || BdApi.Webpack.getByKeys("sendMessage");
            }
            if (typeof BdApi.Webpack.getModule === "function") {
                return BdApi.Webpack.getModule((module) => module?.sendMessage && module?.editMessage)
                    || BdApi.Webpack.getModule((module) => module?.sendMessage);
            }
            return null;
        }, (module) => typeof module?.sendMessage === "function");
    }

    getMessageStore() {
        return this.getCachedModule("MessageStore", () => {
            if (!BdApi.Webpack) return null;
            if (typeof BdApi.Webpack.getStore === "function") {
                const store = BdApi.Webpack.getStore("MessageStore");
                if (store) return store;
            }
            if (BdApi.Webpack.Stores?.MessageStore) return BdApi.Webpack.Stores.MessageStore;
            if (typeof BdApi.Webpack.getByKeys === "function") {
                return BdApi.Webpack.getByKeys("getMessage", "getMessages");
            }
            if (typeof BdApi.Webpack.getModule === "function") {
                return BdApi.Webpack.getModule((module) => module?.getMessage && module?.getMessages);
            }
            return null;
        }, (store) => typeof store?.getMessages === "function" || typeof store?.getMessage === "function");
    }

    getFluxDispatcher() {
        return this.getCachedModule("FluxDispatcher", () => {
            if (!BdApi.Webpack) return null;
            if (typeof BdApi.Webpack.getByKeys === "function") {
                return BdApi.Webpack.getByKeys("actionLogger")
                    || BdApi.Webpack.getByKeys("subscribe", "unsubscribe", "dispatch");
            }
            if (typeof BdApi.Webpack.getModule === "function") {
                return BdApi.Webpack.getModule((module) => module?.actionLogger && module?.subscribe && module?.unsubscribe)
                    || BdApi.Webpack.getModule((module) => module?.subscribe && module?.unsubscribe && module?.dispatch);
            }
            return null;
        }, (module) => typeof module?.subscribe === "function" && typeof module?.unsubscribe === "function");
    }

    getCachedModule(key, resolver, validator = Boolean) {
        const cached = this.moduleCache.get(key);
        if (cached && validator(cached)) return cached;

        const value = resolver();
        if (value && validator(value)) {
            this.moduleCache.set(key, value);
            return value;
        }

        this.moduleCache.delete(key);
        return null;
    }

    hasMessageWithNonce(messageStore, channelId, nonce) {
        const messages = this.getRecentMessages(messageStore, channelId);
        if (!messages) return null;
        return messages.some((message) => String(message?.nonce || "") === String(nonce));
    }

    getRecentMessages(messageStore, channelId) {
        const state = messageStore.getMessages?.(channelId);
        if (Array.isArray(state)) return state;
        if (Array.isArray(state?._array)) return state._array;
        if (Array.isArray(state?.array)) return state.array;
        if (typeof state?.toArray === "function") return state.toArray();
        if (state?._map && typeof state._map.values === "function") return Array.from(state._map.values());
        if (state?.map && typeof state.map.values === "function") return Array.from(state.map.values());
        return null;
    }

    isYabdp4NitroEnabled() {
        try {
            const plugins = BdApi.Plugins;
            if (!plugins) return false;
            if (typeof plugins.isEnabled === "function") return Boolean(plugins.isEnabled("YABDP4Nitro"));

            const plugin = typeof plugins.get === "function"
                ? plugins.get("YABDP4Nitro")
                : null;
            if (plugin) return plugin.enabled !== false && plugin.started !== false;

            if (typeof plugins.getAll === "function") {
                return plugins.getAll()
                    .some((entry) => entry?.name === "YABDP4Nitro" && entry.enabled !== false && entry.started !== false);
            }

            return false;
        }
        catch (_) {
            return false;
        }
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getChannelIdFromLocation() {
        const match = location.pathname.match(/\/channels\/(?:@me|\d+)\/(\d+)/);
        return match ? match[1] : "";
    }

    closePickerAfterSend(mount) {
        if (mount) this.closeKlipyTab(mount, {restoreNative: true});
        const target = document.activeElement instanceof HTMLElement ? document.activeElement : document.body;
        target.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            code: "Escape",
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        }));
    }

    async copyToClipboard(url, options = {}) {
        try {
            await navigator.clipboard.writeText(url);
            if (!options.silent) this.toast("KLIPY GIF URL copied.", "success");
            return true;
        }
        catch (_) {
            const copied = this.copyToClipboardFallback(url);
            if (!options.silent) this.toast(copied ? "KLIPY GIF URL copied." : "Could not copy GIF URL.", copied ? "success" : "error");
            return copied;
        }
    }

    copyToClipboardFallback(url) {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            return document.execCommand("copy");
        }
        catch (_) {
            return false;
        }
        finally {
            textarea.remove();
        }
    }

    formatError(error) {
        if (!error) return "KLIPY request failed.";
        if (error.status === 401 || error.status === 403) return "KLIPY rejected the API key. Check GifSourcePlus settings.";
        if (error.status === 429) return "KLIPY rate limit reached. Try again later.";
        if (error.status) return `KLIPY request failed with HTTP ${error.status}.`;
        return error.message || "KLIPY request failed.";
    }

    getSettingsCopy() {
        const language = this.settings.guideLanguage;
        const base = this.mergeSettingsCopy(SETTINGS_COPY.en, UPDATE_SETTING_COPY.en);
        const localized = this.mergeSettingsCopy(SETTINGS_COPY[language] || SETTINGS_COPY.en, UPDATE_SETTING_COPY[language] || UPDATE_SETTING_COPY.en);
        return this.mergeSettingsCopy(base, localized);
    }

    mergeSettingsCopy(base, override) {
        const merged = {...base, ...override};
        for (const key of ["sections", "fields", "options", "actions"]) {
            merged[key] = {...(base[key] || {}), ...(override[key] || {})};
        }
        for (const key of ["endpointMode", "insertMode", "qualityMode"]) {
            merged.options[key] = {...(base.options?.[key] || {}), ...(override.options?.[key] || {})};
        }
        return merged;
    }

    getTranslatedOptions(copy, key, values) {
        return values.map((value) => [value, copy.options?.[key]?.[value] || SETTINGS_COPY.en.options[key][value] || value]);
    }

    createSettingsHeader(copy) {
        const header = document.createElement("div");
        header.className = "gsp-settings-header";
        const title = document.createElement("h2");
        title.textContent = "GifSourcePlus";
        const description = document.createElement("p");
        description.textContent = copy.headerDescription;
        header.append(title, description);
        return header;
    }

    createSettingsSection(title, children) {
        const section = document.createElement("section");
        section.className = "gsp-settings-section";

        const heading = document.createElement("h3");
        heading.className = "gsp-settings-section-title";
        heading.textContent = title;

        const grid = document.createElement("div");
        grid.className = "gsp-settings-grid";
        grid.append(...children);

        section.append(heading, grid);
        return section;
    }

    createSettingsFooter(copy) {
        const footer = document.createElement("p");
        footer.className = "gsp-settings-footer";
        footer.textContent = copy.footer;
        return footer;
    }

    createLanguageSetting(copy, rerender) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const label = document.createElement("label");
        label.textContent = copy.fields.language[0];

        const select = document.createElement("select");
        select.setAttribute("aria-label", copy.fields.language[0]);

        for (const [code, guide] of Object.entries(API_KEY_GUIDES)) {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = guide.name;
            option.selected = this.settings.guideLanguage === code;
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.settings.guideLanguage = select.value;
            this.saveSettings();
            rerender();
        });

        const help = document.createElement("p");
        help.textContent = copy.fields.language[1];

        wrapper.append(label, select, help);
        return wrapper;
    }

    createToggleSetting(field, key) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const row = document.createElement("label");
        row.className = "gsp-inline";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(this.settings[key]);
        input.addEventListener("change", () => {
            this.settings[key] = input.checked;
            this.saveSettings();
        });

        const labelText = document.createElement("span");
        labelText.textContent = field[0];

        const help = document.createElement("p");
        help.textContent = field[1];

        row.append(input, labelText);
        wrapper.append(row, help);
        return wrapper;
    }

    createPasswordSetting(copy) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const label = document.createElement("label");
        label.textContent = copy.fields.apiKey[0];

        const row = document.createElement("div");
        row.className = "gsp-inline";

        const input = document.createElement("input");
        input.type = "password";
        input.placeholder = copy.fields.apiKey[2];
        input.value = this.settings.apiKey;
        input.autocomplete = "off";
        input.addEventListener("change", () => {
            this.settings.apiKey = input.value.trim();
            this.saveSettings();
        });

        const show = document.createElement("button");
        show.type = "button";
        show.className = "gsp-klipy-button";
        show.textContent = copy.actions.show;
        show.addEventListener("click", () => {
            const visible = input.type === "text";
            input.type = visible ? "password" : "text";
            show.textContent = visible ? copy.actions.show : copy.actions.hide;
        });

        const help = document.createElement("p");
        help.textContent = copy.fields.apiKey[1];

        row.append(input, show);
        wrapper.append(label, row, help);
        return wrapper;
    }

    createApiKeyGuide(copy) {
        const wrapper = document.createElement("section");
        wrapper.className = "gsp-guide-card";

        const top = document.createElement("div");
        top.className = "gsp-guide-top";

        const title = document.createElement("h3");
        title.className = "gsp-guide-title";

        const language = document.createElement("select");
        language.className = "gsp-guide-language";
        language.setAttribute("aria-label", copy.fields.language[0]);

        for (const [code, guide] of Object.entries(API_KEY_GUIDES)) {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = guide.name;
            option.selected = this.settings.guideLanguage === code;
            language.appendChild(option);
        }

        const body = document.createElement("div");
        body.className = "gsp-guide-body";

        const render = () => {
            const guide = API_KEY_GUIDES[this.settings.guideLanguage] || API_KEY_GUIDES.en;
            title.textContent = guide.title;
            body.replaceChildren();

            const intro = document.createElement("p");
            intro.textContent = guide.intro;

            const steps = document.createElement("ol");
            for (const step of guide.steps) {
                const item = document.createElement("li");
                item.textContent = step;
                steps.appendChild(item);
            }

            const link = document.createElement("a");
            link.className = "gsp-guide-link";
            link.href = "https://klipy.com/developers";
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = "https://klipy.com/developers";

            const note = document.createElement("p");
            note.className = "gsp-guide-note";
            note.textContent = guide.note;

            body.append(intro, steps, link, note);
        };

        language.addEventListener("change", () => {
            this.settings.guideLanguage = language.value;
            this.saveSettings();
            render();
        });

        top.append(title, language);
        wrapper.append(top, body);
        render();
        return wrapper;
    }

    createNumberSetting(field, key, min, max) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const label = document.createElement("label");
        label.textContent = field[0];

        const input = document.createElement("input");
        input.type = "number";
        input.min = String(min);
        input.max = String(max);
        input.step = "1";
        input.value = String(this.settings[key]);
        input.addEventListener("change", () => {
            this.settings[key] = this.clampNumber(input.value, min, max, DEFAULT_SETTINGS[key]);
            input.value = String(this.settings[key]);
            this.saveSettings();
        });

        const help = document.createElement("p");
        help.textContent = field[1];

        wrapper.append(label, input, help);
        return wrapper;
    }

    createTextSetting(field, key) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const label = document.createElement("label");
        label.textContent = field[0];

        const input = document.createElement("input");
        input.type = "text";
        input.value = this.settings[key];
        input.addEventListener("change", () => {
            this.settings[key] = input.value.trim() || DEFAULT_SETTINGS[key];
            input.value = this.settings[key];
            this.saveSettings();
        });

        const help = document.createElement("p");
        help.textContent = field[1];

        wrapper.append(label, input, help);
        return wrapper;
    }

    createSelectSetting(field, key, options) {
        const wrapper = document.createElement("div");
        wrapper.className = "gsp-setting";

        const label = document.createElement("label");
        label.textContent = field[0];

        const select = document.createElement("select");
        for (const [value, text] of options) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            option.selected = this.settings[key] === value;
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.settings[key] = select.value;
            this.saveSettings();
        });

        const help = document.createElement("p");
        help.textContent = field[1];

        wrapper.append(label, select, help);
        return wrapper;
    }

    clampNumber(value, min, max, fallback) {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.min(max, Math.max(min, Math.round(number)));
    }

    isVisible(node) {
        const rect = node.getBoundingClientRect();
        return rect.width > 240 && rect.height > 180;
    }

    toast(message, type) {
        if (BdApi.UI && typeof BdApi.UI.showToast === "function") {
            BdApi.UI.showToast(message, {type});
        }
    }
};
