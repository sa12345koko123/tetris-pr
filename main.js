const START_BTN_ID    ="start-btn"
const MAIN_CANVAS_ID  ="main-canvas"
const NEXT_CANVAS_ID  ="next-canvas"
const GAME_SPEED      =500;
const BLOCK_SIZE      =30;
const COLS_COUNT      =10;
const ROWS_COUNT      =20;
const SCREEN_W        = COLS_COUNT*BLOCK_SIZE;
const SCREEN_H        = ROWS_COUNT*BLOCK_SIZE;
const NEXT_AREA_SIZE  =160;
const BLOCK_SOURCES = [
  "images/block-0.png",
  "images/block-1.png",
  "images/block-2.png",
  "images/block-3.png",
  "images/block-4.png",
  "images/block-5.png",
  "images/block-6.png"

  ]

window.onload = function(){
  Asset.init()
  let game = new Game()
  document.getElementById(START_BTN_ID).onclick = function(){
    game.start()
    // ボタンのフォーカスを外す
    this.blur()
  }
}

// 素材を管理するクラス
// ゲーム開始前に初期化する
class Asset{

  // ブロック用imageの配列
  static blockImages = []

  // 初期化処理
  // callbackにはinit完了後に行う処理
  static init(callback){
    let loadCnt = 0
    for(let i=0; i<=6; i++ ){
      let img = new Image();
      img.src = BLOCK_SOURCES[i];
      img.onload = function(){
        loadCnt++
        Asset.blockImages.push(img)

        // 全ての画像読み込みが終われば、callback実行
        if(loadCnt >= BLOCK_SOURCES.length && callback){
          callback()
        }
      }
    }
  }
}

class Game {
  constructor(){
    this.initMainCanvas()
    this.initNextCanvas()
  }
  // メインキャンバスの初期化
  initMainCanvas(){
    this.mainCanvas = document.getElementById(MAIN_CANVAS_ID);
    this.mainCtx = this.mainCanvas.getContext("2d");
    this.mainCanvas.width  = SCREEN_W;
    this.mainCanvas.height = SCREEN_H;
    this.mainCanvas.style.border = "4px solid #555";
  }

  // ネクストキャンバスの初期化
  initNextCanvas(){
    this.nextCanvas = document.getElementById(NEXT_CANVAS_ID);
    this.nextCtx = this.nextCanvas.getContext("2d");
    this.nextCanvas.width  = NEXT_AREA_SIZE;
    this.nextCanvas.height = NEXT_AREA_SIZE;
    this.nextCanvas.style.border = "4px solid #555";
  }

  // ゲーム開始の処理
  start(){

    // フィールドとドミノの初期化
    this.field = new Field()

    // 最初のドミノを読み込み
    this.popMino()

    // 初回描画
    this.drawAll()

    // 落下処理
    clearInterval(this.timer)
    this.timer = setInterval(() => this.dropMino(),100);

    // キーボードイベントの登録
    this.setKeyEvent()
  }

　　// 新しいドミノの読み込み
  popMino(){
    this.mino = this.nextMino ?? newMino()
    this.mino.spawn()
    this.nextMino = new Mino()

    // ゲームオーバー判定
    if(!this.valid(0, 1)){
        this.drawAll()
        clearInterval(this.timer)
        alert("ゲームオーバー")
    }
  }

  // 画面の描画
  drawAll(){
      // 表示クリア
      this.mainCtx.clearRect(0, 0, SCREEN_W, SCREEN_H)
      this.nextCtx.clearRect(0, 0, NEXT_AREA_SIZE, NEXT_AREA_SIZE)

      // 落下済みのミノを描画
      this.field.drawFixedBlocks(this.mainCtx)

      // 再描画
      this.nextMino.drawNext(this.nextCtx)
      this.mino.draw(this.mainCtx)
  }

}








// フィールドクラス
class Field {
  constructor (){
    this.blocks = []
  }
  drawFixedBlocks(ctx){
    this.blocks.forEach(block => block.draw(0, 0, ctx))
  }
  checkLine(){
    for(var r = 0; r < ROWS_COUNT; r++){
      var c = this.blocks.filter(block => block.y === r).length
      if(c === COLS_COUNT){
        this.blocks = this.blocks.filter(block => block.y !== r)
        this.blocks.filter(block => block.y < r).forEach(upper => upper.y++)
      }
    }
  }

  has(x, y){
      return this.blocks.some(block => block.x == x && block.y == y)
  }

}