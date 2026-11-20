/* MORIPALS FORGE v3 — live. Shared logic for index / forge / claim / market.
   v3 contracts deployed 2026-11-20. Mint opens via baw setMintPaused(false). */
const NFT = "0x6067123481fb7DfA923594ba7A414bA3C73Ff1cD"; // MoripalsV3, deployed 2026-11-20
const MARKET = "0xE78782E0f2F05562ae68e0DdF9808852386D79Ae"; // MoripalsV3Market, deployed 2026-11-20
const CLAIM = "0x75622AA18517E6600Ac06E57eb53f6fad8d6F18a"; // MoripalsV3Claim, deployed 2026-11-20
const TOKEN = "0xff88E964403F6EDb7d93d19BaF4BAF186CceCb56"; // $MORP (v2 token, reused for v3)
const DEPLOY_BLOCK = 134625151; // NFT deploy block
const ZERO = "0x0000000000000000000000000000000000000000";
const IS_PLACEHOLDER = NFT === ZERO || MARKET === ZERO || CLAIM === ZERO;
const RPCS = ["https://bsc-dataseed.bnbchain.org","https://rpc-bsc.48.club"];
const SEL_TOTAL = "0xa2309ff8", SEL_PRICEFOR = "0xd527979a", SEL_TOKENURI = "0xc87b56dd", SEL_PAUSED = "0x7e4831d3";
const SEL_LISTED = "0x05337198", SEL_LISTING = "0x107a274a", SEL_OWNEROF = "0x6352211e", SEL_ISAPPROVED = "0xe985e9c5";
const TIERS = [
  {key:"common", name:"Moss Sprout", rarity:"Common", count:5000, color:"#7ED957", img:"images/common.webp"},
  {key:"uncommon", name:"Mushroom Pal", rarity:"Uncommon", count:2500, color:"#FFCD51", img:"images/uncommon.webp"},
  {key:"rare", name:"Firefly Friend", rarity:"Rare", count:1500, color:"#22D3EE", img:"images/rare.webp"},
  {key:"epic", name:"Forest Guardian", rarity:"Epic", count:700, color:"#3B82F6", img:"images/epic.webp"},
  {key:"legendary", name:"Ancient Treant", rarity:"Legendary", count:250, color:"#EC4899", img:"images/legendary.webp"},
  {key:"mythic", name:"Mori Spirit", rarity:"Mythic", count:50, color:"#8B5CF6", img:"images/mythic.webp"}
];
const PRICE_TIERS = [[1,10,"0.00015"],[11,20,"0.0004"],[21,30,"0.0008"]];
let provider=null, signer=null, userAddr=null;
const STR={
en:{"heroH1":"A forest that grows<br>up <em class=\"grad\">alive</em>, in 3D,<br>on-chain.","palsH2":"Every pal has<br>a <em class=\"grad\">home</em>.","mintH2":"Your first pal<br>is <em class=\"grad\">free</em>.","mintIntro":"Your first pal is <b style=\"color:#FFC53D\">FREE</b> — every wallet gets 1 free pal, no pool cap. Then tiered pricing <b style=\"color:#FFC53D\">0.00015 – 0.0008 BNB</b>. Max 30 pals per wallet, max 10 per transaction. Mint from your wallet.","freeRule":"🌱 Your first mint is <b>FREE</b> — 1 first pal per wallet free, no pool cap. Mint #2–10: <b>0.00015 BNB</b> · #11–20: <b>0.0004 BNB</b> · #21–30: <b>0.0008 BNB</b>. Max 30 pals per wallet.","rarityH2":"Six friends,<br><em class=\"grad\">one forest</em>.","marketH2":"Trade your <em class=\"grad\">pals</em>.","marketEmpty":"🌱 <b>No pals on the market yet</b> — be the first to mint, be the first to list.","morpH2":"Hold a pal,<br>claim <em class=\"grad\">$MORP</em>.","docsH2":"How it <em class=\"grad\">works</em>.","docsLi1":"Connect your wallet (BNB Chain). <b>Your first mint is free</b> — every wallet gets 1 free pal, no pool cap.","roadmapH2":"Where the forest <em class=\"grad\">grows</em>.","dfoot":"10,000 FOREST PALS<br>FIRST MINT FREE · BNB CHAIN","title":"MORIPALS — Forest Pals on BNB Chain","menu":"Menu","mintNow":"MINT NOW","mintSoon":"MINT — OPENS SOON","mintLoading":"MINT — LOADING…","mintStatusLive":"Mint status: LIVE","mintStatusSoon":"Mint status: OPENS SOON","noWallet":"No browser wallet detected. Open this site inside your wallet app browser (MetaMask / Trust Wallet / Binance Wallet).","txFee":"Your wallet could not prepare this transaction (empty answer from the browser). Open this site inside your wallet app browser (MetaMask / Trust Wallet / Binance Wallet) and try again.","loadingTier":"Loading tier…","tierLoading":"Tier loading…","mintedOf":"{n} of 10,000 minted ({pct}%)","loadingCount":"Loading live count…","countError":"Could not load live count — check your connection and refresh.","noContract":"Mint not open yet — the v3 contracts are not deployed.","marketOpensLater":"The on-chain market opens after the marketplace contract is deployed.","loadingListings":"Loading listings…","listingsError":"Could not load listings — check your connection and refresh.","noListings":"No pals listed yet — be the first to list one below.","marketNotLive":"The market is not live yet.","badTokenId":"Enter a valid token ID (1–10,000).","badPrice":"Enter a valid price in BNB (more than 0).","ownerCheckFail":"Could not check the token owner — try again.","notOwner":"You don't own that token — only the owner can list it.","approving":"Approving the market contract to move your NFT — confirm in your wallet…","txSent":"Transaction sent: {h} — waiting for confirmation…","listed":"Listed! Tx: {h}","bought":"Bought! Tx: {h}","cancelled":"Listing cancelled — your pal is back in your wallet. Tx: {h}","priceUpdated":"Price updated! Tx: {h}","listFailed":"List failed: {m}","buyFailed":"Buy failed: {m}","cancelFailed":"Cancel failed: {m}","updateFailed":"Update price failed: {m}","mintFailed":"Mint failed: {m}","connectFailed":"Connect failed: {m}","newPrice":"New price in BNB:","mintNotOpen":"Mint is not open yet.","qtyRange":"Quantity must be 1–10.","mintNotYet":"Mint hasn't opened yet — check back soon.","minted":"Minted! Tx: {h}","connected":"CONNECTED: {a}","connectedNote":"Connected. Your price is based on how many you have minted before — your first mint is free.","totalFor":"Total for {q}: {amt} BNB","freeSuffix":" — FREE","seller":"Seller","explorer":"Explorer ↗","cancel":"CANCEL","updatePrice":"UPDATE PRICE","buy":"BUY","phTokenId":"Token ID","phPrice":"Price in BNB",
"previewBar":"FORGE v3 — LIVE · MINT IS LIVE · v2: 257 minted, paused at launch","takePal":"TAKE A PAL","premiseH2":"The premise","premise1T":"01 · THE SEED","premise1D":"A seed falls in the deep green forest. One wallet, one free pal — no pool cap, no gate.","premise2T":"02 · THE GROWTH","premise2D":"Your pal grows with the forest. Six friends, from Moss Sprout to the Mori Spirit — 10,000 in all.","premise3T":"03 · THE FORGE","premise3D":"Three Commons become one Uncommon. Climb the ladder to the Mythic Mori Spirit — only 50 will ever exist.","palsMarqueeH2":"The pals","forgeH2":"Forge your pals<br>into <em class=\"grad\">legends</em>.","forgeIntro":"Three Commons forge into one Uncommon. Two Uncommons into one Rare — climb all the way to the Mythic Mori Spirit. The first 100 forges are gas-only; after that, 1,000 $MORP burns per forge.","forgeLadderH":"THE FORGE LADDER","forgeBurn":"First 100 forges gas-only, then 1,000 $MORP burned per forge.","forgeCountLabel":"FORGES SO FAR","forgeCountSoon":"Forge count loads when v3 deploys.","forgeNotLive":"Forge is not live yet — the v3 contracts are not deployed.","forgeBtn":"FORGE","forgeSoon":"FORGE — OPENS SOON","forgeFailed":"Forge failed: {m}","forged":"Forged! Tx: {h}","tokenH2":"One pal.<br><em class=\"grad\">10,000 $MORP</em>.","tokenIntro":"Every pal claims 10,000 $MORP, once, forever. Claim fee 0.00016 BNB per pal — straight to the forest.","tokenCap":"CAP 200M $MORP","tokenFee":"FEE 0.00016 BNB / PAL","tokenSupply":"SUPPLY 10,000 PALS","journeyH2":"The journey","journey1T":"Phase 01 — v2 done","journey1D":"257 pals minted on v2. The forest proved it grows. v2 pauses when v3 opens.","journey2T":"Phase 02 — v3 mint","journey2D":"Forge v3 mint opens. First pal free, tiered pricing after that, max 30 per wallet.","journey3T":"Phase 03 — Forge season","journey3D":"The forge opens. Climb the ladder, burn $MORP, chase the 50 Mythic Mori Spirits.","journey4T":"Phase 04 — The forest grows","journey4D":"Market, claims and the forest keep growing — one pal at a time.","faqH2":"Questions,<br><em class=\"grad\">answered</em>.","faq1Q":"Is my first mint really free?","faq1A":"Yes. Every wallet's first pal is free, with no pool cap. Mint #2–10 costs 0.00015 BNB, #11–20 costs 0.0004 BNB, #21–30 costs 0.0008 BNB.","faq2Q":"How does the forge work?","faq2A":"Burn 3 Commons to forge 1 Uncommon, 2 Uncommons to 1 Rare, 2 Rares to 1 Epic, 2 Epics to 1 Legendary, 2 Legendaries to 1 Mythic. The first 100 forges are gas-only; after that each forge burns 1,000 $MORP.","faq3Q":"What is $MORP?","faq3A":"$MORP is the forest token. Each pal claims 10,000 $MORP once, for a fee of 0.00016 BNB per pal. Cap 200M.","faq4Q":"Is v3 mint live?","faq4A":"The v3 contracts are deployed and mint is LIVE — v2 (257 minted) is paused.","finalH2":"There's a pal<br>waiting <em class=\"grad\">for you</em>.","finalP":"10,000 pals. One forest. Your first one is free.","claimH2":"Claim your <em class=\"grad\">$MORP</em>.","claimIntro":"Each pal claims 10,000 $MORP, once. Fee 0.00016 BNB per pal. Connect your wallet and scan your pals.","claimBadgeSoon":"CLAIM — OPENS SOON","claimBadgeLive":"CLAIM — LIVE","claimNotLive":"Claim is not live yet — the token and claim contracts are not deployed.","minterSoon":"Claim opens soon — the claim contract is not wired to the token yet.","scanPals":"SCAN MY PALS","enterIds":"OR ENTER TOKEN IDS","claimBtn":"CLAIM {n} MORP","claimedSoFar":"Pals claimed so far: ","balPrefix":"MORP balance: ","balSuffix":" MORP","foundUnclaimedN":"Found {n} unclaimed pals. Tap a card to deselect.","foundUnclaimed1":"Found 1 unclaimed pal. Tap a card to deselect.","allClaimed":"All your pals already claimed their MORP.","noPals":"No pals found for this wallet.","scanMsg":"Scanning your pals on-chain... this may take a few seconds.","scanFail":"Scan failed: ","enterId":"Enter at least one token ID.","checkingIds":"Checking those token IDs...","noneManual":"None of those token IDs can be claimed by this wallet (not owned or already claimed).","claimSendN":"Sending claim transaction for {n} pals...","claimSend1":"Sending claim transaction for 1 pal...","claimSent":"Transaction sent: ","waiting":" — waiting for confirmation...","claimed":"Claimed! {n} MORP should now be in your wallet. Tx: ","claimFail":"Claim failed: ","selA":"Selected: ","selPalN":" pals = ","selPal1":" pal = ","selC":" MORP — fee: ","selD":" BNB","connectFail2":"Connect failed: ","connected2":"Connected. Scan your pals or enter token IDs.","marketFeeNote":"Market fee: 5% — the seller receives 95% of the sale price. Fees go to the collection owner.","royaltyNote":"Royalty 5% on every sale. Escrow market — your pal stays safe until it sells.","v2Note":"v2: 257 minted — paused at v3 launch."},
ja:{"heroH1":"育つ森、<em class=\"grad\">生きている</em>。<br>3Dで、オンチェーンに。","palsH2":"すべてのパルに<br><em class=\"grad\">すみか</em>がある。","mintH2":"最初のパルは<br><em class=\"grad\">無料</em>。","mintIntro":"最初のパルは<b style=\"color:#FFC53D\">無料</b> — すべてのウォレットが1体無料、プール上限なし。その後は段階価格<b style=\"color:#FFC53D\">0.00015 – 0.0008 BNB</b>。1ウォレット最大30体、1回最大10体。自分のウォレットからミント。","freeRule":"🌱 初回ミントは<b>無料</b> — 1ウォレットにつき最初の1体無料、プール上限なし。ミント #2–10：<b>0.00015 BNB</b> · #11–20：<b>0.0004 BNB</b> · #21–30：<b>0.0008 BNB</b>。1ウォレット最大30体。","rarityH2":"6人の仲間、<br><em class=\"grad\">ひとつの森</em>。","marketH2":"<em class=\"grad\">パル</em>をトレード。","marketEmpty":"🌱 <b>まだマーケットにパルはありません</b> — 最初にミントして、最初に出品しよう。","morpH2":"パルを持って、<br><em class=\"grad\">$MORP</em>をクレーム。","docsH2":"仕組みは<em class=\"grad\">こう</em>。","docsLi1":"ウォレットを接続（BNBチェーン）。<b>初回ミントは無料</b> — すべてのウォレットが1体無料、プール上限なし。","roadmapH2":"森が<em class=\"grad\">育つ</em>場所。","dfoot":"10,000体の森のパル<br>初回ミント無料 · BNBチェーン","title":"MORIPALS — BNBチェーンの森のパル","menu":"メニュー","mintNow":"今すぐミント","mintSoon":"ミント — 近日公開","mintLoading":"ミント — 読み込み中…","mintStatusLive":"ミント状況：ライブ","mintStatusSoon":"ミント状況：近日公開","noWallet":"ブラウザウォレットが検出されませんでした。このサイトをウォレットアプリのブラウザ（MetaMask / Trust Wallet / Binance Wallet）で開いてください。","txFee":"ウォレットがこのトランザクションを準備できませんでした（ブラウザからの応答が空でした）。このサイトをウォレットアプリのブラウザ（MetaMask / Trust Wallet / Binance Wallet）で開いて、もう一度お試しください。","loadingTier":"ティアを読み込み中…","tierLoading":"ティア読み込み中…","mintedOf":"{n} / 10,000 ミント済み（{pct}%）","loadingCount":"ライブ数を読み込み中…","countError":"ライブ数を読み込めませんでした — 接続を確認して更新してください。","noContract":"ミントはまだ開始していません — v3コントラクトはまだデプロイされていません。","marketOpensLater":"オンチェーンマーケットは、マーケットプレイスコントラクトのデプロイ後に開きます。","loadingListings":"出品を読み込み中…","listingsError":"出品を読み込めませんでした — 接続を確認して更新してください。","noListings":"まだ出品されたパルはありません — 下から最初に出品しよう。","marketNotLive":"マーケットはまだライブではありません。","badTokenId":"有効なトークンIDを入力してください（1–10,000）。","badPrice":"BNBで有効な価格を入力してください（0より大きい値）。","ownerCheckFail":"トークンの所有者を確認できませんでした — もう一度お試しください。","notOwner":"そのトークンはあなたのものではありません — 所有者のみ出品できます。","approving":"NFTの移動のためマーケットコントラクトを承認中 — ウォレットで確認してください…","txSent":"トランザクション送信済み：{h} — 確認待ち…","listed":"出品完了！Tx：{h}","bought":"購入完了！Tx：{h}","cancelled":"出品をキャンセルしました — パルはウォレットに戻りました。Tx：{h}","priceUpdated":"価格を更新しました！Tx：{h}","listFailed":"出品に失敗しました：{m}","buyFailed":"購入に失敗しました：{m}","cancelFailed":"キャンセルに失敗しました：{m}","updateFailed":"価格の更新に失敗しました：{m}","mintFailed":"ミントに失敗しました：{m}","connectFailed":"接続に失敗しました：{m}","newPrice":"新しい価格（BNB）：","mintNotOpen":"ミントはまだ開始していません。","qtyRange":"数量は1–10で指定してください。","mintNotYet":"ミントはまだ開始していません — また後でお越しください。","minted":"ミント完了！Tx：{h}","connected":"接続済み：{a}","connectedNote":"接続しました。価格はこれまでにミントした数に基づきます — 初回ミントは無料です。","totalFor":"合計 {q}体：{amt} BNB","freeSuffix":" — 無料","seller":"売り手","explorer":"エクスプローラー ↗","cancel":"キャンセル","updatePrice":"価格を更新","buy":"購入","phTokenId":"トークンID","phPrice":"価格（BNB）",
"previewBar":"FORGE v3 — ライブ · ミント開始 · v2：257ミント済み、停止済み","takePal":"パルを迎える","premiseH2":"はじまり","premise1T":"01 · タネ","premise1D":"深い緑の森に、ひとつのタネが落ちる。1ウォレットにつき1体無料 — プール上限なし、ゲートなし。","premise2T":"02 · 成長","premise2D":"パルは森とともに育つ。モス・スプラウトからモリ・スピリットまで、6人の仲間 — 合計10,000体。","premise3T":"03 · フォージ","premise3D":"コモン3体がアンコモン1体に。ラダーを登ってミシックのモリ・スピリットへ — 存在するのは50体だけ。","palsMarqueeH2":"パルたち","forgeH2":"パルを鍛えて<br><em class=\"grad\">伝説</em>に。","forgeIntro":"コモン3体がアンコモン1体に。アンコモン2体がレア1体に — ミシックのモリ・スピリットまで登りつめよう。最初の100フォージはガスのみ、その後は1フォージにつき1,000 $MORPをバーン。","forgeLadderH":"フォージ・ラダー","forgeBurn":"最初の100フォージはガスのみ、その後は1フォージにつき1,000 $MORPをバーン。","forgeCountLabel":"これまでのフォージ数","forgeCountSoon":"フォージ数はv3デプロイ後に表示されます。","forgeNotLive":"フォージはまだ開始していません — v3コントラクトはまだデプロイされていません。","forgeBtn":"フォージ","forgeSoon":"フォージ — 近日公開","forgeFailed":"フォージに失敗しました：{m}","forged":"フォージ完了！Tx：{h}","tokenH2":"1体のパル。<br><em class=\"grad\">10,000 $MORP</em>。","tokenIntro":"すべてのパルが10,000 $MORPを1回だけクレームできます。手数料は1体あたり0.00016 BNB — 森へまっすぐ。","tokenCap":"上限 2億 $MORP","tokenFee":"手数料 0.00016 BNB / 体","tokenSupply":"供給 10,000体","journeyH2":"旅路","journey1T":"フェーズ01 — v2完了","journey1D":"v2で257体がミントされた。森は育つことが証明された。v3開始時にv2は停止する。","journey2T":"フェーズ02 — v3ミント","journey2D":"Forge v3のミントが開く。初回無料、その後は段階価格、1ウォレット最大30体。","journey3T":"フェーズ03 — フォージ・シーズン","journey3D":"フォージが開く。ラダーを登り、$MORPをバーンし、50体のミシック・モリ・スピリットを追いかけよう。","journey4T":"フェーズ04 — 森は育つ","journey4D":"マーケット、クレーム、森は育ち続ける — 1体ずつ。","faqH2":"質問に<br><em class=\"grad\">答える</em>。","faq1Q":"初回ミントは本当に無料ですか？","faq1A":"はい。すべてのウォレットの最初の1体は無料で、プール上限はありません。#2–10は0.00015 BNB、#11–20は0.0004 BNB、#21–30は0.0008 BNBです。","faq2Q":"フォージの仕組みは？","faq2A":"コモン3体でアンコモン1体、アンコモン2体でレア1体、レア2体でエピック1体、エピック2体でレジェンダリー1体、レジェンダリー2体でミシック1体。最初の100フォージはガスのみ、その後は1フォージにつき1,000 $MORPをバーンします。","faq3Q":"$MORPとは？","faq3A":"$MORPは森のトークンです。各パルが10,000 $MORPを1回だけクレームでき、手数料は1体あたり0.00016 BNBです。上限は2億。","faq4Q":"v3のミントはライブですか？","faq4A":"v3コントラクトはデプロイ済みで、ミントはライブです — v2（257ミント済み）は停止しています。","finalH2":"パルが<br><em class=\"grad\">あなたを待っている</em>。","finalP":"10,000体のパル。ひとつの森。最初の一体は無料。","claimH2":"<em class=\"grad\">$MORP</em>をクレーム。","claimIntro":"各パルが10,000 $MORPを1回だけクレームできます。手数料は1体あたり0.00016 BNB。ウォレットを接続してパルをスキャン。","claimBadgeSoon":"請求 — まもなく開始","claimBadgeLive":"請求 — ライブ","claimNotLive":"請求はまだ開始していません——トークンと請求コントラクトはまだデプロイされていません。","minterSoon":"請求はまもなく開始——請求コントラクトはまだトークンに接続されていません。","scanPals":"パルをスキャン","enterIds":"またはトークンIDを入力","claimBtn":"{n} MORPをクレーム","claimedSoFar":"これまでに請求されたパル：","balPrefix":"MORP残高：","balSuffix":" MORP","foundUnclaimedN":"未請求のパルが{n}体見つかりました。タップで選択解除できます。","foundUnclaimed1":"未請求のパルが1体見つかりました。タップで選択解除できます。","allClaimed":"すべてのパルがすでにMORPを請求済みです。","noPals":"このウォレットのパルは見つかりませんでした。","scanMsg":"オンチェーンでパルをスキャン中…数秒かかる場合があります。","scanFail":"スキャンに失敗しました：","enterId":"トークンIDを少なくとも1つ入力してください。","checkingIds":"それらのトークンIDを確認中…","noneManual":"これらのトークンIDはいずれもこのウォレットでは請求できません（未所有または請求済み）。","claimSendN":"{n}体のパルの請求トランザクションを送信中…","claimSend1":"1体のパルの請求トランザクションを送信中…","claimSent":"トランザクション送信：","waiting":" — 確認待ち…","claimed":"請求完了！{n} MORPがウォレットに入っているはずです。Tx：","claimFail":"請求に失敗しました：","selA":"選択：","selPalN":" 体 = ","selPal1":" 体 = ","selC":" MORP — 手数料：","selD":" BNB","connectFail2":"接続に失敗しました：","connected2":"接続しました。パルをスキャンするか、トークンIDを入力してください。","marketFeeNote":"マーケット手数料：5% — 売り手は販売価格の95%を受け取ります。手数料はコレクションのオーナーへ。","royaltyNote":"すべての販売に5%のロイヤリティ。エスクロー型マーケット — パルは売れるまで安全に保管されます。","v2Note":"v2：257ミント済み — v3開始で停止済み。"},
zh:{"heroH1":"一片不断生长的森林，<br>在3D中<em class=\"grad\">鲜活</em>存在，<br>就在链上。","palsH2":"每个伙伴都有<br>一个<em class=\"grad\">家</em>。","mintH2":"你的第一个伙伴<br><em class=\"grad\">免费</em>。","mintIntro":"你的第一个伙伴<b style=\"color:#FFC53D\">免费</b> — 每个钱包可免费获得1个，无数量上限。之后阶梯定价<b style=\"color:#FFC53D\">0.00015 – 0.0008 BNB</b>。每个钱包最多30个，每次最多10个。从你的钱包铸造。","freeRule":"🌱 首次铸造<b>免费</b> — 每个钱包第一个免费，无数量上限。第 #2–10 次：<b>0.00015 BNB</b> · #11–20：<b>0.0004 BNB</b> · #21–30：<b>0.0008 BNB</b>。每个钱包最多30个。","rarityH2":"六位朋友，<br><em class=\"grad\">一片森林</em>。","marketH2":"交易你的<em class=\"grad\">伙伴</em>。","marketEmpty":"🌱 <b>市场上还没有伙伴</b> — 成为第一个铸造、第一个挂单的人。","morpH2":"持有伙伴，<br>领取<em class=\"grad\">$MORP</em>。","docsH2":"它如何<em class=\"grad\">运作</em>。","docsLi1":"连接你的钱包（BNB链）。<b>首次铸造免费</b> — 每个钱包可免费获得1个，无数量上限。","roadmapH2":"森林<em class=\"grad\">生长</em>的方向。","dfoot":"10,000个森林伙伴<br>首次铸造免费 · BNB链","title":"MORIPALS — BNB链上的森林伙伴","menu":"菜单","mintNow":"立即铸造","mintSoon":"铸造 — 即将开放","mintLoading":"铸造 — 加载中…","mintStatusLive":"铸造状态：已上线","mintStatusSoon":"铸造状态：即将开放","noWallet":"未检测到浏览器钱包。请在钱包应用的浏览器（MetaMask / Trust Wallet / Binance Wallet）中打开本站。","txFee":"你的钱包无法准备此交易（浏览器返回为空）。请在钱包应用的浏览器（MetaMask / Trust Wallet / Binance Wallet）中打开本站并重试。","loadingTier":"正在加载稀有度…","tierLoading":"稀有度加载中…","mintedOf":"{n} / 10,000 已铸造（{pct}%）","loadingCount":"正在加载实时数量…","countError":"无法加载实时数量 — 请检查网络并刷新。","noContract":"铸造尚未开放 — v3合约尚未部署。","marketOpensLater":"链上市场将在市场合约部署后开放。","loadingListings":"正在加载挂单…","listingsError":"无法加载挂单 — 请检查网络并刷新。","noListings":"还没有伙伴挂单 — 在下方第一个挂单吧。","marketNotLive":"市场尚未上线。","badTokenId":"请输入有效的代币ID（1–10,000）。","badPrice":"请输入有效的BNB价格（大于0）。","ownerCheckFail":"无法确认代币所有者 — 请重试。","notOwner":"你不拥有该代币 — 只有所有者才能挂单。","approving":"正在授权市场合约转移你的NFT — 请在钱包中确认…","txSent":"交易已发送：{h} — 等待确认…","listed":"已挂单！Tx：{h}","bought":"已购买！Tx：{h}","cancelled":"已取消挂单 — 你的伙伴已回到钱包。Tx：{h}","priceUpdated":"价格已更新！Tx：{h}","listFailed":"挂单失败：{m}","buyFailed":"购买失败：{m}","cancelFailed":"取消失败：{m}","updateFailed":"更新价格失败：{m}","mintFailed":"铸造失败：{m}","connectFailed":"连接失败：{m}","newPrice":"新价格（BNB）：","mintNotOpen":"铸造尚未开放。","qtyRange":"数量必须为1–10。","mintNotYet":"铸造尚未开放 — 请稍后再来。","minted":"铸造成功！Tx：{h}","connected":"已连接：{a}","connectedNote":"已连接。你的价格取决于你之前已铸造的数量 — 首次铸造免费。","totalFor":"总计 {q} 个：{amt} BNB","freeSuffix":" — 免费","seller":"卖家","explorer":"浏览器 ↗","cancel":"取消","updatePrice":"更新价格","buy":"购买","phTokenId":"代币ID","phPrice":"价格（BNB）",
"previewBar":"FORGE v3 — 已上线 · 铸造已开启 · v2：已铸造257个，已暂停","takePal":"领取伙伴","premiseH2":"缘起","premise1T":"01 · 种子","premise1D":"一颗种子落入深绿森林。每个钱包一个免费伙伴 — 无数量上限，无需门槛。","premise2T":"02 · 成长","premise2D":"你的伙伴与森林一起成长。从苔藓芽到森灵，六位朋友 — 共10,000个。","premise3T":"03 · 熔炉","premise3D":"3个普通锻造成1个非凡。沿着阶梯一路登顶神话森灵 — 永远只有50个。","palsMarqueeH2":"伙伴们","forgeH2":"把伙伴锻造成<br><em class=\"grad\">传奇</em>。","forgeIntro":"3个普通锻造出1个非凡，2个非凡锻造出1个稀有 — 一路登顶神话森灵。前100次锻造只收gas，之后每次锻造燃烧1,000 $MORP。","forgeLadderH":"熔炉阶梯","forgeBurn":"前100次锻造只收gas，之后每次锻造燃烧1,000 $MORP。","forgeCountLabel":"迄今锻造次数","forgeCountSoon":"锻造次数将在v3部署后显示。","forgeNotLive":"熔炉尚未开启 — v3合约尚未部署。","forgeBtn":"锻造","forgeSoon":"锻造 — 即将开放","forgeFailed":"锻造失败：{m}","forged":"锻造成功！Tx：{h}","tokenH2":"一个伙伴。<br><em class=\"grad\">10,000 $MORP</em>。","tokenIntro":"每个伙伴可领取10,000 $MORP，一次，永久。领取手续费每位伙伴0.00016 BNB — 直达森林。","tokenCap":"总量 2亿 $MORP","tokenFee":"手续费 0.00016 BNB / 个","tokenSupply":"总量 10,000个伙伴","journeyH2":"旅程","journey1T":"第一阶段 — v2完成","journey1D":"v2已铸造257个伙伴。森林证明了它会生长。v3开启时v2暂停。","journey2T":"第二阶段 — v3铸造","journey2D":"Forge v3铸造开启。第一个免费，之后阶梯定价，每个钱包最多30个。","journey3T":"第三阶段 — 熔炉季","journey3D":"熔炉开启。登上阶梯，燃烧$MORP，追逐50个神话森灵。","journey4T":"第四阶段 — 森林生长","journey4D":"市场、领取与森林持续生长 — 一次一个伙伴。","faqH2":"问题，<br><em class=\"grad\">已有答案</em>。","faq1Q":"首次铸造真的免费吗？","faq1A":"是的。每个钱包的第一个伙伴免费，无数量上限。第#2–10次0.00015 BNB，第#11–20次0.0004 BNB，第#21–30次0.0008 BNB。","faq2Q":"熔炉如何运作？","faq2A":"3个普通锻造1个非凡，2个非凡锻造1个稀有，2个稀有锻造1个史诗，2个史诗锻造1个传说，2个传说锻造1个神话。前100次锻造只收gas，之后每次燃烧1,000 $MORP。","faq3Q":"$MORP是什么？","faq3A":"$MORP是森林代币。每个伙伴可领取10,000 $MORP一次，手续费每位伙伴0.00016 BNB。总量2亿。","faq4Q":"v3铸造已上线了吗？","faq4A":"v3合约已部署，铸造已上线 — v2（已铸造257个）已暂停。","finalH2":"有个伙伴<br>正在<em class=\"grad\">等你</em>。","finalP":"10,000个伙伴。一片森林。第一个免费。","claimH2":"领取你的<em class=\"grad\">$MORP</em>。","claimIntro":"每个伙伴可领取10,000 $MORP，一次。手续费每位伙伴0.00016 BNB。连接钱包并扫描你的伙伴。","claimBadgeSoon":"领取 — 即将开启","claimBadgeLive":"领取 — 已开启","claimNotLive":"领取尚未开启——代币与领取合约尚未部署。","minterSoon":"领取即将开启——领取合约尚未与代币连接。","scanPals":"扫描我的伙伴","enterIds":"或输入代币ID","claimBtn":"领取 {n} MORP","claimedSoFar":"迄今已领取的伙伴：","balPrefix":"MORP 余额：","balSuffix":" MORP","foundUnclaimedN":"找到 {n} 位未领取的伙伴。点按卡片可取消选择。","foundUnclaimed1":"找到 1 位未领取的伙伴。点按卡片可取消选择。","allClaimed":"你所有的伙伴都已领取过 MORP。","noPals":"未找到该钱包的伙伴。","scanMsg":"正在链上扫描你的伙伴……可能需要几秒钟。","scanFail":"扫描失败：","enterId":"请至少输入一个 Token ID。","checkingIds":"正在检查这些 Token ID……","noneManual":"这些 Token ID 均无法由该钱包领取（未拥有或已领取）。","claimSendN":"正在为 {n} 位伙伴发送领取交易……","claimSend1":"正在为 1 位伙伴发送领取交易……","claimSent":"交易已发送：","waiting":" — 等待确认…","claimed":"领取成功！{n} MORP 应已进入你的钱包。Tx：","claimFail":"领取失败：","selA":"已选：","selPalN":" 位 = ","selPal1":" 位 = ","selC":" MORP — 手续费：","selD":" BNB","connectFail2":"连接失败：","connected2":"已连接。扫描你的伙伴或输入 Token ID。","marketFeeNote":"市场手续费：5% — 卖家获得售价的95%。手续费归收藏品所有者。","royaltyNote":"每笔销售收取5%版税。托管市场 — 伙伴在售出前安全保管。","v2Note":"v2：已铸造257个 — v3上线时已暂停。"},
ko:{"heroH1":"자라나는 숲, <em class=\"grad\">살아 있는</em> 3D,<br>온체인에서.","palsH2":"모든 친구에게는<br><em class=\"grad\">집</em>이 있다。","mintH2":"첫 번째 친구는<br><em class=\"grad\">무료</em>。","mintIntro":"첫 번째 친구는<b style=\"color:#FFC53D\">무료</b> — 모든 지갑이 1개 무료, 풀 상한 없음. 이후 단계별 가격<b style=\"color:#FFC53D\">0.00015 – 0.0008 BNB</b>。지갑당 최대 30개, 트랜잭션당 최대 10개. 내 지갑에서 민트.","freeRule":"🌱 첫 민트는<b>무료</b> — 지갑당 첫 1개 무료, 풀 상한 없음. 민트 #2–10: <b>0.00015 BNB</b> · #11–20: <b>0.0004 BNB</b> · #21–30: <b>0.0008 BNB</b>. 지갑당 최대 30개.","rarityH2":"여섯 친구,<br><em class=\"grad\">하나의 숲</em>。","marketH2":"<em class=\"grad\">친구들</em>을 거래하세요.","marketEmpty":"🌱 <b>마켓에 아직 친구가 없습니다</b> — 가장 먼저 민트하고, 가장 먼저 매물을 등록하세요。","morpH2":"친구를 보유하고,<br><em class=\"grad\">$MORP</em>를 클레임하세요.","docsH2":"작동 <em class=\"grad\">방식</em>。","docsLi1":"지갑을 연결하세요(BNB 체인). <b>첫 민트는 무료</b> — 모든 지갑이 1개 무료, 풀 상한 없음.","roadmapH2":"숲이 <em class=\"grad\">자라는</em> 곳。","dfoot":"10,000개의 숲 친구들<br>첫 민트 무료 · BNB 체인","title":"MORIPALS — BNB 체인의 숲 친구들","menu":"메뉴","mintNow":"지금 민트","mintSoon":"민트 — 곧 오픈","mintLoading":"민트 — 로딩 중…","mintStatusLive":"민트 상태: 라이브","mintStatusSoon":"민트 상태: 곧 오픈","noWallet":"브라우저 지갑이 감지되지 않았습니다. 이 사이트를 지갑 앱 브라우저(MetaMask / Trust Wallet / Binance Wallet)에서 열어주세요.","txFee":"지갑이 이 트랜잭션을 준비할 수 없었습니다(브라우저 응답이 비어 있음). 이 사이트를 지갑 앱 브라우저(MetaMask / Trust Wallet / Binance Wallet)에서 열고 다시 시도하세요.","loadingTier":"티어 불러오는 중…","tierLoading":"티어 로딩 중…","mintedOf":"{n} / 10,000 민트됨({pct}%)","loadingCount":"실시간 개수 불러오는 중…","countError":"실시간 개수를 불러올 수 없습니다 — 연결을 확인하고 새로고침하세요.","noContract":"민트가 아직 열리지 않았습니다 — v3 컨트랙트가 아직 배포되지 않았습니다.","marketOpensLater":"온체인 마켓은 마켓플레이스 컨트랙트 배포 후 열립니다.","loadingListings":"매물 불러오는 중…","listingsError":"매물을 불러올 수 없습니다 — 연결을 확인하고 새로고침하세요.","noListings":"아직 등록된 친구가 없습니다 — 아래에서 가장 먼저 등록하세요.","marketNotLive":"마켓이 아직 라이브가 아닙니다.","badTokenId":"유효한 토큰 ID를 입력하세요(1–10,000).","badPrice":"BNB로 유효한 가격을 입력하세요(0보다 큰 값).","ownerCheckFail":"토큰 소유자를 확인할 수 없습니다 — 다시 시도하세요.","notOwner":"해당 토큰은 당신의 것이 아닙니다 — 소유자만 매물을 등록할 수 있습니다.","approving":"NFT 이동을 위해 마켓 컨트랙트를 승인하는 중 — 지갑에서 확인하세요…","txSent":"트랜잭션 전송됨: {h} — 확인 대기 중…","listed":"등록 완료! Tx: {h}","bought":"구매 완료! Tx: {h}","cancelled":"매물이 취소되었습니다 — 친구가 지갑으로 돌아왔습니다. Tx: {h}","priceUpdated":"가격이 업데이트되었습니다! Tx: {h}","listFailed":"등록 실패: {m}","buyFailed":"구매 실패: {m}","cancelFailed":"취소 실패: {m}","updateFailed":"가격 업데이트 실패: {m}","mintFailed":"민트 실패: {m}","connectFailed":"연결 실패: {m}","newPrice":"새 가격(BNB):","mintNotOpen":"민트가 아직 열리지 않았습니다.","qtyRange":"수량은 1–10이어야 합니다.","mintNotYet":"민트가 아직 열리지 않았습니다 — 나중에 다시 확인하세요.","minted":"민트 완료! Tx: {h}","connected":"연결됨: {a}","connectedNote":"연결되었습니다. 가격은 이전에 민트한 개수에 따라 정해집니다 — 첫 민트는 무료입니다.","totalFor":"합계 {q}개: {amt} BNB","freeSuffix":" — 무료","seller":"판매자","explorer":"익스플로러 ↗","cancel":"취소","updatePrice":"가격 업데이트","buy":"구매","phTokenId":"토큰 ID","phPrice":"가격(BNB)",
"previewBar":"FORGE v3 — 라이브 · 민트 오픈 · v2: 257개 민트됨, 일시정지됨","takePal":"친구 데려가기","premiseH2":"시작","premise1T":"01 · 씨앗","premise1D":"깊은 초록 숲에 씨앗 하나가 떨어진다. 지갑당 첫 친구 1개 무료 — 풀 상한 없음, 게이트 없음.","premise2T":"02 · 성장","premise2D":"친구는 숲과 함께 자란다. 이끼 싹부터 모리 스피릿까지, 여섯 친구 — 총 10,000개.","premise3T":"03 · 대장간","premise3D":"커먼 3개가 언커먼 1개가 된다. 사다리를 올라 신화 모리 스피릿까지 — 단 50개만 존재한다.","palsMarqueeH2":"친구들","forgeH2":"친구를 단련해<br><em class=\"grad\">전설</em>로.","forgeIntro":"커먼 3개가 언커먼 1개로, 언커먼 2개가 레어 1개로 — 신화 모리 스피릿까지 올라가세요. 첫 100회 대장간은 가스만, 이후 회당 1,000 $MORP 소각.","forgeLadderH":"대장간 사다리","forgeBurn":"첫 100회 대장간은 가스만, 이후 회당 1,000 $MORP 소각.","forgeCountLabel":"지금까지의 대장간 횟수","forgeCountSoon":"대장간 횟수는 v3 배포 후 표시됩니다.","forgeNotLive":"대장간이 아직 열리지 않았습니다 — v3 컨트랙트가 아직 배포되지 않았습니다.","forgeBtn":"대장간","forgeSoon":"대장간 — 곧 오픈","forgeFailed":"대장간 실패: {m}","forged":"대장간 완료! Tx: {h}","tokenH2":"친구 하나.<br><em class=\"grad\">10,000 $MORP</em>。","tokenIntro":"모든 친구는 10,000 $MORP를 단 한 번 클레임합니다. 수수료는 친구당 0.00016 BNB — 숲으로 직행.","tokenCap":"상한 2억 $MORP","tokenFee":"수수료 0.00016 BNB / 개","tokenSupply":"공급 10,000개","journeyH2":"여정","journey1T":"1단계 — v2 완료","journey1D":"v2에서 257개가 민트되었다. 숲은 자란다는 것을 증명했다. v3가 열리면 v2는 멈춘다.","journey2T":"2단계 — v3 민트","journey2D":"Forge v3 민트가 열린다. 첫 민트 무료, 이후 단계별 가격, 지갑당 최대 30개.","journey3T":"3단계 — 대장간 시즌","journey3D":"대장간이 열린다. 사다리를 오르고, $MORP를 소각하고, 50개의 신화 모리 스피릿을 노려라.","journey4T":"4단계 — 숲이 자란다","journey4D":"마켓, 클레임, 숲은 계속 자란다 — 한 번에 친구 하나씩.","faqH2":"질문에<br><em class=\"grad\">답하다</em>。","faq1Q":"첫 민트가 정말 무료인가요?","faq1A":"네. 모든 지갑의 첫 친구는 무료이며 풀 상한이 없습니다. #2–10은 0.00015 BNB, #11–20은 0.0004 BNB, #21–30은 0.0008 BNB입니다.","faq2Q":"대장간은 어떻게 작동하나요?","faq2A":"커먼 3개로 언커먼 1개, 언커먼 2개로 레어 1개, 레어 2개로 에픽 1개, 에픽 2개로 레전더리 1개, 레전더리 2개로 신화 1개. 첫 100회는 가스만, 이후 회당 1,000 $MORP를 소각합니다.","faq3Q":"$MORP란 무엇인가요?","faq3A":"$MORP는 숲의 토큰입니다. 각 친구는 10,000 $MORP를 단 한 번 클레임하며, 수수료는 친구당 0.00016 BNB입니다. 상한 2억.","faq4Q":"v3 민트가 라이브인가요?","faq4A":"v3 컨트랙트가 배포되었고 민트가 라이브입니다 — v2(257개 민트됨)는 일시정지되었습니다.","finalH2":"친구 하나가<br><em class=\"grad\">당신을 기다립니다</em>。","finalP":"10,000개의 친구. 하나의 숲. 첫 친구는 무료.","claimH2":"<em class=\"grad\">$MORP</em>를 클레임하세요.","claimIntro":"각 친구는 10,000 $MORP를 단 한 번 클레임합니다. 수수료는 친구당 0.00016 BNB. 지갑을 연결하고 친구를 스캔하세요.","claimBadgeSoon":"청구 — 곧 오픈","claimBadgeLive":"청구 — 라이브","claimNotLive":"청구가 아직 시작되지 않았습니다 — 토큰과 청구 컨트랙트가 아직 배포되지 않았습니다.","minterSoon":"청구가 곧 오픈합니다 — 청구 컨트랙트가 아직 토큰에 연결되지 않았습니다.","scanPals":"내 친구 스캔","enterIds":"또는 토큰 ID 입력","claimBtn":"{n} MORP 클레임","claimedSoFar":"지금까지 청구된 친구:","balPrefix":"MORP 잔액: ","balSuffix":" MORP","foundUnclaimedN":"미청구 친구 {n}개를 찾았습니다. 카드를 눌러 선택을 해제하세요.","foundUnclaimed1":"미청구 친구 1개를 찾았습니다. 카드를 눌러 선택을 해제하세요.","allClaimed":"모든 친구가 이미 MORP를 청구했습니다.","noPals":"이 지갑의 친구를 찾을 수 없습니다.","scanMsg":"온체인에서 친구를 스캔하는 중… 몇 초 걸릴 수 있습니다.","scanFail":"스캔 실패: ","enterId":"토큰 ID를 최소 하나 입력하세요.","checkingIds":"해당 토큰 ID를 확인하는 중…","noneManual":"이 토큰 ID들은 이 지갑으로 청구할 수 없습니다(미소유 또는 이미 청구됨).","claimSendN":"{n}개 친구의 청구 트랜잭션을 보내는 중…","claimSend1":"1개 친구의 청구 트랜잭션을 보내는 중…","claimSent":"트랜잭션 전송됨: ","waiting":" — 확인 대기 중…","claimed":"청구 완료! {n} MORP가 지갑에 들어왔을 것입니다. Tx: ","claimFail":"청구 실패: ","selA":"선택:","selPalN":"개 = ","selPal1":"개 = ","selC":" MORP — 수수료: ","selD":" BNB","connectFail2":"연결 실패: ","connected2":"연결됨. 친구를 스캔하거나 토큰 ID를 입력하세요.","marketFeeNote":"마켓 수수료: 5% — 판매자는 판매가의 95%를 받습니다. 수수료는 컬렉션 소유자에게 갑니다.","royaltyNote":"모든 판매에 5% 로열티. 에스크로 마켓 — 친구는 팔릴 때까지 안전하게 보관됩니다.","v2Note":"v2: 257개 민트됨 — v3 출시 시 일시정지됨."}
};
let LANG="en";
try{ LANG=localStorage.getItem("moripals-v3-lang")||(function(){var b=(navigator.language||"en").slice(0,2).toLowerCase();return ["en","ja","zh","ko"].indexOf(b)>=0?b:"en";})(); }catch(e){ LANG="en"; }
let lastPaused=null, barState="loading", displayedMinted=0, lastMarketN=-1;
function T(k,v){var s=(STR[LANG]&&STR[LANG][k])||STR.en[k]||k;if(v){for(var x in v){s=s.split("{"+x+"}").join(String(v[x]));}}return s;}
function setLang(l){
  LANG=["en","ja","zh","ko"].indexOf(l)>=0?l:"en";
  try{localStorage.setItem("moripals-v3-lang",LANG);}catch(e){}
  document.documentElement.lang=LANG;
  document.querySelectorAll("[data-en]").forEach(function(el){var v=el.dataset[LANG]||el.dataset.en;if(v!==undefined){if(el.children.length)el.innerHTML=v;else el.textContent=v;}});
  document.querySelectorAll("[data-i18n]").forEach(function(el){var k=el.dataset.i18n;var v=(STR[LANG]&&STR[LANG][k])||STR.en[k];if(v!==undefined)el.innerHTML=v;});
  document.querySelectorAll("[data-lang]").forEach(function(b){b.classList.toggle("on",b.dataset.lang===LANG);});
  document.title=T("title");
  var bb=document.getElementById("burgerBtn");if(bb)bb.setAttribute("aria-label",T("menu"));
  var ti=document.getElementById("listTokenId");if(ti)ti.placeholder=T("phTokenId");
  var lp=document.getElementById("listPrice");if(lp)lp.placeholder=T("phPrice");
  if(lastPaused!==null)setPausedUI(lastPaused);
  var lbl=document.getElementById("barLabel");
  if(lbl){ if(barState==="loading")lbl.textContent=T("loadingCount"); else if(barState==="error")lbl.textContent=T("countError"); else if(barState==="nocontract")lbl.textContent=T("noContract"); else if(barState==="count")setMinted(displayedMinted); }
  var fb=document.getElementById("forgeBadge"); if(fb) fb.textContent=T("forgeSoon");
  var cb=document.getElementById("claimBadge"); if(cb) cb.textContent=T("claimBadgeSoon");
  updateSelLine();
}
function toggleMenu(){var d=document.getElementById("drawer");if(!d)return;d.classList.toggle("open");document.getElementById("scrim").classList.toggle("on");document.getElementById("burgerBtn").classList.toggle("open");document.body.style.overflow=d.classList.contains("open")?"hidden":"";}
async function rpcCall(to,data){
  for(const url of RPCS){
    try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_call",params:[{to,data},"latest"]})});const j=await r.json();if(j.result)return j.result;}catch(e){}
  } return null;
}
async function rpcGasPrice(){
  for(const url of RPCS){
    try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_gasPrice",params:[]})});const j=await r.json();if(j.result)return BigInt(j.result);}catch(e){}
  } return 1000000000n;
}
function txErrMsg(e){
  const m=(e&&e.message)||String(e||"");
  if(m.indexOf("invalid BigNumberish")>=0||m.indexOf("value=null")>=0){return T("txFee");}
  return (e&&e.reason)||m;
}
async function sendTx(tx,gasLimit){
  const gp=await rpcGasPrice();
  return signer.sendTransaction({...tx,gasPrice:gp,gasLimit:BigInt(gasLimit)});
}
function updateNoWallet(){
  const show=!window.ethereum;
  document.querySelectorAll(".nowallet").forEach(function(w){w.textContent=show?T("noWallet"):"";w.classList.toggle("show",show);});
}
function setMinted(n){
  const start=displayedMinted,t0=performance.now(),dur=700;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fmt(v){return Math.round(v).toLocaleString();}
  function apply(v){
    ["mintedHero","mintedStat"].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent=fmt(v);});
    var bar=document.getElementById("barFill");if(bar)bar.style.width=(v/10000*100)+"%";
    var barH=document.getElementById("barFillHero");if(barH)barH.style.width=(v/10000*100)+"%";
    var lbl=document.getElementById("barLabel");if(lbl)lbl.textContent=T("mintedOf",{n:fmt(v),pct:(v/10000*100).toFixed(2)});
    var cc=document.getElementById("ctaCount");if(cc)cc.textContent=fmt(v);
  }
  if(reduced||start===n){displayedMinted=n;apply(n);return;}
  function step(t){var p=Math.min(1,(t-t0)/dur);var e=1-Math.pow(1-p,3);var v=start+(n-start)*e;apply(v);if(p<1)requestAnimationFrame(step);else displayedMinted=n;}
  requestAnimationFrame(step);
}
function setPausedUI(paused){
  lastPaused=paused;
  ["mintBtn","mintBtnHero"].forEach(function(id){var b=document.getElementById(id);if(b){b.disabled=paused;b.textContent=paused?T("mintSoon"):T("mintNow");}});
  var ms=document.getElementById("mintStatus");if(ms)ms.textContent=paused?T("mintStatusSoon"):T("mintStatusLive");
}
function setLoadingUI(){
  ["mintBtn","mintBtnHero"].forEach(function(id){var b=document.getElementById(id);if(b){b.disabled=true;b.textContent=T("mintLoading");}});
}
async function refresh(){
  if(IS_PLACEHOLDER){
    barState="nocontract";
    ["mintedHero","mintedStat"].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent="—";});
    var cc=document.getElementById("ctaCount");if(cc)cc.textContent="—";
    var lbl=document.getElementById("barLabel");if(lbl)lbl.textContent=T("noContract");
    setPausedUI(true);
    var fc=document.getElementById("forgeCount");if(fc)fc.textContent="—";
    var fl=document.getElementById("forgeCountNote");if(fl)fl.textContent=T("forgeCountSoon");
    loadListings(); return;
  }
  const res=await rpcCall(NFT,SEL_TOTAL);
  if(!res){barState="error";var l2=document.getElementById("barLabel");if(l2)l2.textContent=T("countError");setPausedUI(true);return;}
  setMinted(parseInt(res,16));barState="count";
  const pres=await rpcCall(NFT,SEL_PAUSED);
  setPausedUI(!pres||BigInt(pres)===1n);
  loadMarket();loadListings();
}
function priceForQty(q,mintedBefore){
  // Local tiered pricing (same tiers as contract): #1 free, #2-10 0.00015, #11-20 0.0004, #21-30 0.0008 BNB.
  var total=0;
  for(var i=0;i<q;i++){var n=mintedBefore+i+1;if(n===1)continue;else if(n<=10)total+=0.00015;else if(n<=20)total+=0.0004;else total+=0.0008;}
  return total;
}
function setQty(v){var q=document.getElementById("qty");if(q){q.value=v;}updateCost();}
async function updateCost(){
  var qEl=document.getElementById("qty");if(!qEl)return;
  var q=parseInt(qEl.value)||1;
  var tc=document.getElementById("totalCost");if(!tc)return;
  if(IS_PLACEHOLDER){tc.textContent="";return;}
  if(!userAddr)return;
  const data=SEL_PRICEFOR+userAddr.slice(2).padStart(64,"0")+q.toString(16).padStart(64,"0");
  const res=await rpcCall(NFT,data);
  if(!res)return;
  const wei=BigInt(res);
  tc.textContent=T("totalFor",{q:q,amt:(Number(wei)/1e18).toFixed(5)})+(wei===0n?T("freeSuffix"):"");
}
async function connectWallet(){
  var msgEl=document.getElementById("mintMsg")||document.getElementById("marketMsg")||document.getElementById("claimMsg");
  if(!window.ethereum){if(msgEl)msgEl.textContent=T("noWallet");updateNoWallet();return;}
  try{
    provider=new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts",[]);
    const net=await provider.getNetwork();
    if(net.chainId!==56n){try{await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x38"}]});}catch(e){if(e&&e.code===4902){await window.ethereum.request({method:"wallet_addEthereumChain",params:[{chainId:"0x38",chainName:"BNB Smart Chain",nativeCurrency:{name:"BNB",symbol:"BNB",decimals:18},rpcUrls:["https://bsc-dataseed.bnbchain.org"],blockExplorerUrls:["https://bscscan.com"]}]});}else{throw e;}}}
    signer=await provider.getSigner();userAddr=await signer.getAddress();
    var cb=document.getElementById("connectBtn");if(cb)cb.textContent=T("connected",{a:userAddr.slice(0,6)+"…"+userAddr.slice(-4)});
    if(msgEl)msgEl.textContent=T("connectedNote");
    updateCost();
  }catch(e){if(msgEl)msgEl.textContent=T("connectFailed",{m:(e.message||e)});}
}
async function mintNow(){
  var msgEl=document.getElementById("mintMsg");if(!msgEl)return;
  if(IS_PLACEHOLDER){msgEl.textContent=T("mintNotOpen");return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  var q=parseInt(document.getElementById("qty").value)||1;
  if(q<1||q>10){msgEl.textContent=T("qtyRange");return;}
  const pres=await rpcCall(NFT,SEL_PAUSED);
  if(!pres||BigInt(pres)===1n){msgEl.textContent=T("mintNotYet");return;}
  try{
    const data=SEL_PRICEFOR+userAddr.slice(2).padStart(64,"0")+q.toString(16).padStart(64,"0");
    const res=await rpcCall(NFT,data);
    const value=res?BigInt(res):0n;
    const iface=new ethers.Interface(["function mint(uint256 quantity)"]);
    const tx=await sendTx({to:NFT,data:iface.encodeFunctionData("mint",[q]),value},300000);
    msgEl.textContent="Transaction sent: "+tx.hash+" — waiting for confirmation…";
    await tx.wait();
    msgEl.textContent=T("minted",{h:tx.hash});
    refresh();
  }catch(e){msgEl.textContent=T("mintFailed",{m:txErrMsg(e)});}
}
function abiDecodeString(hex){
  hex=hex.startsWith("0x")?hex.slice(2):hex;
  if(hex.length<128)return "";
  const len=parseInt(hex.slice(64,128),16);
  const bytes=hex.slice(128,128+len*2);
  const arr=new Uint8Array((bytes.match(/../g)||[]).map(function(h){return parseInt(h,16);}));
  return new TextDecoder().decode(arr);
}
function tierImgFor(charName){
  var t=TIERS.find(function(x){return x.name===charName;});
  return t?t.img:(TIERS[0].img);
}
function shortAddr(a){return a.slice(0,6)+"…"+a.slice(-4);}
async function loadMarket(){
  var board=document.getElementById("marketBoard");
  var empty=document.getElementById("marketEmpty");
  if(!board||!empty)return;
  if(IS_PLACEHOLDER){board.style.display="none";empty.style.display="block";return;}
  const res=await rpcCall(NFT,SEL_TOTAL);
  const n=res?parseInt(res,16):0;
  if(!n){board.style.display="none";empty.style.display="block";lastMarketN=0;return;}
  if(n===lastMarketN)return;
  lastMarketN=n;
  empty.style.display="none";board.style.display="grid";
  board.innerHTML="";
  var ids=[];for(var id=n;id>=Math.max(1,n-7);id--)ids.push(id);
  for(const id of ids){
    var card=document.createElement("div");card.className="mkt-card";
    card.innerHTML='<img src="'+TIERS[0].img+'" alt="MORIPALS #'+id+'"><div class="mkt-body"><b>MORIPALS #'+id+'</b><span>'+T("loadingTier")+'</span><div class="mkt-links"><a href="https://bscscan.com/address/'+NFT+'" target="_blank" rel="noopener">'+T("explorer")+'</a></div></div>';
    board.appendChild(card);
    var imgEl=card.querySelector("img");var spanEl=card.querySelector(".mkt-body span");
    try{
      const uriRes=await rpcCall(NFT,SEL_TOKENURI+id.toString(16).padStart(64,"0"));
      const uri=abiDecodeString(uriRes||"");
      const meta=await (await fetch(uri)).json();
      const attrs={};(meta.attributes||[]).forEach(function(a){attrs[a.trait_type]=a.value;});
      const charName=attrs["Character"]||"";const rarity=attrs["Rarity"]||"";
      imgEl.src=tierImgFor(charName);
      spanEl.textContent=(rarity?rarity+" · ":"")+charName;
    }catch(e){spanEl.textContent=T("loadingTier");}
  }
}
async function loadListings(){
  var grid=document.getElementById("marketGrid");
  if(!grid)return;
  if(IS_PLACEHOLDER){grid.innerHTML="<div class='mkt-note'>"+T("marketOpensLater")+"</div>";return;}
  grid.innerHTML="<div class='mkt-note'>"+T("loadingListings")+"</div>";
  const res=await rpcCall(MARKET,SEL_LISTED);
  if(!res){grid.innerHTML="<div class='mkt-note'>"+T("listingsError")+"</div>";return;}
  var ids=[];
  try{ids=ethers.AbiCoder.defaultAbiCoder().decode(["uint256[]"],res)[0].map(function(x){return Number(x);});}catch(e){grid.innerHTML="<div class='mkt-note'>"+T("listingsError")+"</div>";return;}
  if(!ids.length){grid.innerHTML="<div class='mkt-note'>"+T("noListings")+"</div>";return;}
  grid.innerHTML="";
  for(const id of ids){
    const lres=await rpcCall(MARKET,SEL_LISTING+id.toString(16).padStart(64,"0"));
    if(!lres)continue;
    var seller,price,active;
    try{var d=ethers.AbiCoder.defaultAbiCoder().decode(["address","uint256","bool"],lres);seller=d[0];price=d[1];active=d[2];}catch(e){continue;}
    if(!active)continue;
    var img=TIERS[0].img,rarity="",charName="";
    try{
      const uriRes=await rpcCall(NFT,SEL_TOKENURI+id.toString(16).padStart(64,"0"));
      const uri=abiDecodeString(uriRes||"");
      const meta=await (await fetch(uri)).json();
      const attrs={};(meta.attributes||[]).forEach(function(a){attrs[a.trait_type]=a.value;});
      charName=attrs["Character"]||"";rarity=attrs["Rarity"]||"";
      img=tierImgFor(charName);
    }catch(e){}
    var priceBnb=(Number(price)/1e18).toFixed(5);
    var mine=userAddr&&seller.toLowerCase()===userAddr.toLowerCase();
    var card=document.createElement("div");card.className="mkt-card";
    card.innerHTML='<img src="'+img+'" alt="MORIPALS #'+id+'"><div class="mkt-body"><b>MORIPALS #'+id+'</b><span>'+(rarity?rarity+" · ":"")+charName+'</span><div class="mkt-price">'+priceBnb+' BNB</div><div class="mkt-seller">'+T("seller")+': '+shortAddr(seller)+'</div><div class="mkt-row">'+(mine?'<button class="btn-ghost" onclick="cancelNow('+id+')">'+T("cancel")+'</button><button class="btn-ghost" onclick="updatePriceNow('+id+')">'+T("updatePrice")+'</button>':'<button class="btn-gold" onclick="buyNow('+id+',&quot;'+price.toString()+'&quot;)">'+T("buy")+'</button>')+'</div></div>';
    grid.appendChild(card);
  }
  if(!grid.children.length){grid.innerHTML="<div class='mkt-note'>"+T("noListings")+"</div>";}
}
async function listNow(){
  var msg=document.getElementById("marketMsg");if(!msg)return;
  if(IS_PLACEHOLDER){msg.textContent=T("marketNotLive");return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  var id=parseInt(document.getElementById("listTokenId").value);
  var priceStr=document.getElementById("listPrice").value;
  if(!id||id<1||id>10000){msg.textContent=T("badTokenId");return;}
  var priceWei;
  try{priceWei=ethers.parseEther(priceStr);}catch(e){priceWei=0n;}
  if(priceWei<=0n){msg.textContent=T("badPrice");return;}
  try{
    const ores=await rpcCall(NFT,SEL_OWNEROF+id.toString(16).padStart(64,"0"));
    if(!ores){msg.textContent=T("ownerCheckFail");return;}
    const tokenOwner=ethers.AbiCoder.defaultAbiCoder().decode(["address"],ores)[0];
    if(tokenOwner.toLowerCase()!==userAddr.toLowerCase()){msg.textContent=T("notOwner");return;}
    const ares=await rpcCall(NFT,SEL_ISAPPROVED+userAddr.slice(2).padStart(64,"0")+MARKET.slice(2).padStart(64,"0"));
    const approved=ares?ethers.AbiCoder.defaultAbiCoder().decode(["bool"],ares)[0]:false;
    if(!approved){
      msg.textContent=T("approving");
      const ifaceA=new ethers.Interface(["function setApprovalForAll(address operator, bool approved)"]);
      const txA=await sendTx({to:NFT,data:ifaceA.encodeFunctionData("setApprovalForAll",[MARKET,true])},100000);
      await txA.wait();
    }
    const iface=new ethers.Interface(["function list(uint256 tokenId, uint256 price)"]);
    const tx=await sendTx({to:MARKET,data:iface.encodeFunctionData("list",[id,priceWei])},300000);
    msg.textContent=T("txSent",{h:tx.hash});
    await tx.wait();
    msg.textContent=T("listed",{h:tx.hash});
    loadListings();
  }catch(e){msg.textContent=T("listFailed",{m:txErrMsg(e)});}
}
async function buyNow(id,priceWei){
  var msg=document.getElementById("marketMsg");if(!msg)return;
  if(IS_PLACEHOLDER)return;
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  try{
    const iface=new ethers.Interface(["function buy(uint256 tokenId)"]);
    const tx=await sendTx({to:MARKET,data:iface.encodeFunctionData("buy",[id]),value:BigInt(priceWei)},300000);
    msg.textContent=T("txSent",{h:tx.hash});
    await tx.wait();
    msg.textContent=T("bought",{h:tx.hash});
    loadListings();refresh();
  }catch(e){msg.textContent=T("buyFailed",{m:txErrMsg(e)});}
}
async function cancelNow(id){
  var msg=document.getElementById("marketMsg");if(!msg)return;
  if(IS_PLACEHOLDER)return;
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  try{
    const iface=new ethers.Interface(["function cancel(uint256 tokenId)"]);
    const tx=await sendTx({to:MARKET,data:iface.encodeFunctionData("cancel",[id])},200000);
    msg.textContent=T("txSent",{h:tx.hash});
    await tx.wait();
    msg.textContent=T("cancelled",{h:tx.hash});
    loadListings();
  }catch(e){msg.textContent=T("cancelFailed",{m:txErrMsg(e)});}
}
async function updatePriceNow(id){
  var msg=document.getElementById("marketMsg");if(!msg)return;
  if(IS_PLACEHOLDER)return;
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  var v=window.prompt(T("newPrice"));
  if(v===null)return;
  var priceWei;
  try{priceWei=ethers.parseEther(v);}catch(e){priceWei=0n;}
  if(priceWei<=0n){msg.textContent=T("badPrice");return;}
  try{
    const iface=new ethers.Interface(["function updatePrice(uint256 tokenId, uint256 newPrice)"]);
    const tx=await sendTx({to:MARKET,data:iface.encodeFunctionData("updatePrice",[id,priceWei])},200000);
    msg.textContent=T("txSent",{h:tx.hash});
    await tx.wait();
    msg.textContent=T("priceUpdated",{h:tx.hash});
    loadListings();
  }catch(e){msg.textContent=T("updateFailed",{m:txErrMsg(e)});}
}
/* ---- Forge (v3) ---- */
var forgeSel={from:0,to:1};
function forgeStep(i){
  forgeSel.from=i;forgeSel.to=Math.min(i+1,5);
  document.querySelectorAll(".ladder-row").forEach(function(r,j){r.style.borderColor=(j===i)?"rgba(255,197,61,.7)":"";});
  var fb=document.getElementById("forgeBtn");
  if(fb)fb.textContent=T("forgeBtn")+" — "+TIERS[i].name+" → "+TIERS[i+1].name;
  var fm=document.getElementById("forgeMsg");if(fm)fm.textContent="";
}
async function forgeNow(){
  var msg=document.getElementById("forgeMsg");if(!msg)return;
  if(IS_PLACEHOLDER){msg.textContent=T("forgeNotLive");return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  try{
    const iface=new ethers.Interface(["function forge(uint256 fromTier, uint256 quantity)"]);
    const tx=await sendTx({to:NFT,data:iface.encodeFunctionData("forge",[forgeSel.from,1])},300000);
    msg.textContent=T("txSent",{h:tx.hash});
    await tx.wait();
    msg.textContent=T("forged",{h:tx.hash});
    refresh();
  }catch(e){msg.textContent=T("forgeFailed",{m:txErrMsg(e)});}
}
/* ---- Claim (v3) ---- */
var claimSelected=new Set(), claimUnclaimed=[], claimMinterOk=false, claimLastBal=null, claimLastClaimed=null, claimFeePerNft=null;
var CLAIM_ABI=["function claim(uint256[]) payable","function claimed(uint256) view returns (bool)","function feePerNft() view returns (uint256)","function ALLOCATION() view returns (uint256)"];
var TOKEN_ABI=["function balanceOf(address) view returns (uint256)","function totalSupply() view returns (uint256)","function minter() view returns (address)"];
var NFT_ABI=["function ownerOf(uint256) view returns (address)"];
function claimMsg(t){var el=document.getElementById("claimMsg");if(el)el.textContent=t;}
function updateSelLine(){
  var el=document.getElementById("selLine");if(!el)return;
  if(!claimSelected.size){el.textContent="";var cb=document.getElementById("claimBtn");if(cb)cb.disabled=true;return;}
  var n=claimSelected.size;
  var fee=claimFeePerNft!==null?(Number(claimFeePerNft)*n/1e18):0.00016*n;
  el.textContent=T("selA")+n+(n===1?T("selPal1"):T("selPalN"))+(n*10000).toLocaleString()+T("selC")+fee.toFixed(5)+T("selD");
  var cb2=document.getElementById("claimBtn");if(cb2){cb2.disabled=IS_PLACEHOLDER||!claimMinterOk;cb2.textContent=T("claimBtn",{n:(n*10000).toLocaleString()});}
}
function renderClaimCards(){
  var grid=document.getElementById("claimGrid");if(!grid)return;
  grid.innerHTML="";
  claimUnclaimed.forEach(function(id){
    var card=document.createElement("div");card.className="claim-card"+(claimSelected.has(id)?" sel":"");
    card.innerHTML='<img src="'+TIERS[0].img+'" alt="MORIPALS #'+id+'"><div class="mkt-body"><b>MORIPALS #'+id+'</b><span>10,000 $MORP</span></div>';
    card.onclick=function(){if(claimSelected.has(id))claimSelected.delete(id);else claimSelected.add(id);renderClaimCards();updateSelLine();};
    grid.appendChild(card);
  });
}
async function scanPals(){
  if(IS_PLACEHOLDER){claimMsg(T("claimNotLive"));return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  claimMsg(T("scanMsg"));
  try{
    var rp=new ethers.JsonRpcProvider(RPCS[0]);
    var nft=new ethers.Contract(NFT,NFT_ABI,rp);
    var cl=new ethers.Contract(CLAIM,CLAIM_ABI,rp);
    var total=await nft.totalSupply?null:null;
    claimUnclaimed=[];claimSelected=new Set();
    // Scan via Transfer events from DEPLOY_BLOCK
    var logs=await rp.getLogs({address:NFT,fromBlock:DEPLOY_BLOCK,toBlock:"latest",topics:["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",null,ethers.zeroPadValue(userAddr,32)]});
    var owned=new Set();
    logs.forEach(function(l){try{var id=Number(ethers.AbiCoder.defaultAbiCoder().decode(["uint256"],l.topics[3])[0]);owned.add(id);}catch(e){}});
    for(const id of owned){
      try{var o=await nft.ownerOf(id);if(o.toLowerCase()!==userAddr.toLowerCase())continue;var c=await cl.claimed(id);if(!c)claimUnclaimed.push(id);}catch(e){}
    }
    claimUnclaimed.sort(function(a,b){return a-b;});
    if(!claimUnclaimed.length){claimMsg(owned.size?T("allClaimed"):T("noPals"));}
    else{claimMsg(claimUnclaimed.length===1?T("foundUnclaimed1"):T("foundUnclaimedN",{n:claimUnclaimed.length}));claimUnclaimed.forEach(function(id){claimSelected.add(id);});}
    renderClaimCards();updateSelLine();
  }catch(e){claimMsg(T("scanFail")+(e.message||e));}
}
async function checkIds(){
  if(IS_PLACEHOLDER){claimMsg(T("claimNotLive"));return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  var raw=(document.getElementById("manualIds")||{}).value||"";
  var ids=raw.split(/[^0-9]+/).filter(Boolean).map(Number).filter(function(n){return n>=1&&n<=10000;});
  if(!ids.length){claimMsg(T("enterId"));return;}
  claimMsg(T("checkingIds"));
  try{
    var rp=new ethers.JsonRpcProvider(RPCS[0]);
    var nft=new ethers.Contract(NFT,NFT_ABI,rp);
    var cl=new ethers.Contract(CLAIM,CLAIM_ABI,rp);
    claimUnclaimed=[];claimSelected=new Set();
    for(const id of ids){
      try{var o=await nft.ownerOf(id);if(o.toLowerCase()!==userAddr.toLowerCase())continue;var c=await cl.claimed(id);if(!c)claimUnclaimed.push(id);}catch(e){}
    }
    if(!claimUnclaimed.length){claimMsg(T("noneManual"));}
    else{claimMsg(claimUnclaimed.length===1?T("foundUnclaimed1"):T("foundUnclaimedN",{n:claimUnclaimed.length}));claimUnclaimed.forEach(function(id){claimSelected.add(id);});}
    renderClaimCards();updateSelLine();
  }catch(e){claimMsg(T("scanFail")+(e.message||e));}
}
async function claimNow(){
  if(IS_PLACEHOLDER){claimMsg(T("claimNotLive"));return;}
  if(!claimSelected.size){claimMsg(T("enterId"));return;}
  if(!signer){updateNoWallet();await connectWallet();if(!signer)return;}
  var ids=Array.from(claimSelected);
  try{
    claimMsg(ids.length===1?T("claimSend1"):T("claimSendN",{n:ids.length}));
    var fee=claimFeePerNft!==null?claimFeePerNft*BigInt(ids.length):ethers.parseEther("0.00016")*BigInt(ids.length);
    const iface=new ethers.Interface(CLAIM_ABI);
    const tx=await sendTx({to:CLAIM,data:iface.encodeFunctionData("claim",[ids]),value:fee},300000);
    claimMsg(T("claimSent")+tx.hash+T("waiting"));
    await tx.wait();
    claimMsg(T("claimed",{n:(ids.length*10000).toLocaleString()})+tx.hash);
    claimSelected=new Set();renderClaimCards();updateSelLine();loadClaimStats();
  }catch(e){claimMsg(T("claimFail")+txErrMsg(e));}
}
async function loadClaimStats(){
  var mc=document.getElementById("morpClaimedLine");
  if(IS_PLACEHOLDER){if(mc)mc.textContent=T("claimedSoFar")+"—";return;}
  try{
    var rp=new ethers.JsonRpcProvider(RPCS[0]);
    var cl=new ethers.Contract(CLAIM,CLAIM_ABI,rp);
    claimFeePerNft=await cl.feePerNft();
    var tok=new ethers.Contract(TOKEN,TOKEN_ABI,rp);
    var m=await tok.minter();
    claimMinterOk=m.toLowerCase()===CLAIM.toLowerCase();
    var cb=document.getElementById("claimBadge");if(cb)cb.textContent=claimMinterOk?T("claimBadgeLive"):T("claimBadgeSoon");
    if(!claimMinterOk)claimMsg(T("minterSoon"));
    if(mc){
      var supply=await tok.totalSupply();
      var claimed=Number(supply)/10000;
      claimLastClaimed=claimed;
      mc.textContent=T("claimedSoFar")+claimed.toLocaleString();
    }
    if(userAddr){
      var bal=await tok.balanceOf(userAddr);
      claimLastBal=bal;
      var bl=document.getElementById("balLine");if(bl)bl.textContent=T("balPrefix")+ethers.formatEther(bal)+T("balSuffix");
    }
    updateSelLine();
  }catch(e){var cb2=document.getElementById("claimBadge");if(cb2)cb2.textContent=T("claimBadgeSoon");}
}
/* ---- fireflies canvas (v2 sky, amber/green) ---- */
(function sky(){
  var cv=document.getElementById("sky");
  if(!cv)return;
  var ctx=cv.getContext("2d");
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W=0,H=0,stars=[],flies=[],mx=0,my=0,tx=0,ty=0;
  function size(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;
    stars=[];for(var i=0;i<110;i++){stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.4,ph:Math.random()*6.28,sp:.4+Math.random()*1.2});}
    flies=[];for(var j=0;j<18;j++){flies.push({x:Math.random()*W,y:Math.random()*H,r:1.4+Math.random()*1.4,ph:Math.random()*6.28,sp:.15+Math.random()*.3,dx:(Math.random()-.5)*.25});}
  }
  size();window.addEventListener("resize",size);
  window.addEventListener("mousemove",function(e){tx=(e.clientX/W-.5)*14;ty=(e.clientY/H-.5)*10;});
  function draw(t){
    ctx.clearRect(0,0,W,H);
    mx+=(tx-mx)*.04;my+=(ty-my)*.04;
    ctx.save();ctx.translate(mx,my);
    for(var s of stars){var a=.25+.65*Math.abs(Math.sin(t*.001*s.sp+s.ph));ctx.globalAlpha=a;ctx.fillStyle="#F7F3E6";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill();}
    for(var f of flies){var x=f.x+Math.sin(t*.0004*f.sp+f.ph)*36+t*.004*f.dx;var y=f.y+Math.cos(t*.0005*f.sp+f.ph)*22;var aa=.35+.5*Math.abs(Math.sin(t*.0012*f.sp+f.ph));
      ctx.globalAlpha=aa*.18;ctx.fillStyle="#FFCD51";ctx.beginPath();ctx.arc(((x%W)+W)%W,((y%H)+H)%H,f.r*2.5,0,6.28);ctx.fill();
      ctx.globalAlpha=aa;ctx.fillStyle="#D8F7C5";ctx.beginPath();ctx.arc(((x%W)+W)%W,((y%H)+H)%H,f.r,0,6.28);ctx.fill();}
    ctx.restore();ctx.globalAlpha=1;
    if(!reduced)requestAnimationFrame(draw);
  }
  draw(0);
})();
/* ---- boot ---- */
setLang(LANG);
setLoadingUI();
updateNoWallet();
refresh();
if(document.getElementById("claimGrid")||document.getElementById("claimBadge"))loadClaimStats();
setInterval(refresh,30000);
document.querySelectorAll(".reveal").forEach(function(el){new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");o.disconnect();}})}).observe(el);});
window.addEventListener("scroll",function(){var cta=document.getElementById("mobileCta");if(!cta)return;cta.classList.toggle("show",window.scrollY>560&&window.innerWidth<=768);},{passive:true});
var qEl=document.getElementById("qty");if(qEl)qEl.addEventListener("input",function(){updateCost();});
/* hover tilt on pal cards */
document.querySelectorAll(".pal-card").forEach(function(card){
  card.addEventListener("mousemove",function(e){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    var r=card.getBoundingClientRect();
    var rx=((e.clientY-r.top)/r.height-.5)*-6, ry=((e.clientX-r.left)/r.width-.5)*6;
    card.style.transform="translateY(-6px) rotateX("+rx+"deg) rotateY("+ry+"deg)";
  });
  card.addEventListener("mouseleave",function(){card.style.transform="";});
});
