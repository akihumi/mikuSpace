enchant();                          // おまじない

window.addEventListener('load', function(){
    game = new Game(320, 320); 
    game.fps = 24;                  
    game.preload(['./img/miku.gif','./img/negi.png','./img/enemy.png','./img/back.jpg']);
    game.overFlag = false;

    game.addEventListener('load', function(){
        game.frameCount = 0;
	      game.rootScene.backgroundColor = '#000000';

	      var back = new Sprite(320, 320);
	      back.image = game.assets["./img/back.jpg"];
	      back.width = height = 320;
	      
        player = new Sprite(44, 32);  
        player.x = game.width / 2;                 
        player.y = 100;              
        player.width = 44;
        player.height = 32; 
        player.image = game.assets['./img/miku.gif'];
        player.frame = 0;
        player.laft = true;

    	  player.addEventListener('enterframe',function(){
		        //画面端チェック
		        if(this.x < 0){		
                this.x = 0;
            }
		        if(this.y < 0){
		            this.y = 0;
		        }
            var rightEnd = game.width - this.width;
            if( this.x > rightEnd ){
                this.x = rightEnd;
            }
		        var underEnd = game.height - this.height;
		        if( this.y > underEnd ){
		            this.y = underEnd;
		        }
		        //キー操作
            if(game.overFlag){
                this.frame = 3;
            }else{
                this.left ? this.frame = 0 : this.frame = 7;
            }
		        if( game.input.left ){
                this.x -= 5;
                if(game.overFlag){
                    this.frame = 3;
                }else{
                    this.frame = game.frame % 2 + 1;
                    this.left = true;
                }
            };
            if( game.input.right ){
                this.x += 5;
                if(game.overFlag){
                    this.frame = 3;
                }else{
                    this.frame = game.frame % 2 + 5;
                    this.left = false;
                }
            };
            if( game.input.up ){
                this.y -= 5;
                if(game.overFlag){
                    this.frame = 3;
                }else{
                    this.left ? this.frame = game.frame % 2 + 1 : this.frame = game.frame % 2 + 5;
                }
            };
            if( game.input.down ){
                this.y += 5;
                if(game.overFlag){
                    this.frame = 3;
                }else{
                    this.left ? this.frame = game.frame % 2 + 1 : this.frame = game.frame % 2 + 5;
                }
            };
	      });
	      game.rootScene.addChild(player);

	      scoreLabel = new Label("");         // スコアの表示 
        scoreLabel.x = scoreLabel.y = 8;
	      scoreLabel.color = "#ffffff";
        scoreLabel.addEventListener('enterframe', function(){
            this.text =" TIME: " + (120 - game.frameCount/game.fps).toFixed(2);
        });
	      game.rootScene.addChild(scoreLabel);

	      //毎回する処理
        game.rootScene.addEventListener('enterframe',function(){
            var count = game.frameCount / game.fps;
            var f = false;
            if(rand(2) == 0){
                f = true;
            }
 	          if(count < 15){
	              if(game.frame % 8 == 0){ 
                    new Enemiku(game, f);
	              }
            }else if(count > 15 && count < 30){
	              if(game.frame % 8 == 0){
                    new Enegi(game, f);
	              }
            }else if(count > 30 && count < 60){
	              if(game.frame % 4 == 0){
                    new Enemiku(game, f);
	              }
            }else if(count > 60 && count < 90){
	              if(game.frame % 4 == 0){
                    new Enegi(game, f);
	              }
            }else if(count > 90){
	              if(game.frame % 8 == 0){
                    new Enemiku(game, f);
                    new Enegi(game, f);
	              }
            }
	          game.frameCount++;
	          game.score = Math.floor(((count).toFixed(0) / 120) * 100);
	          //クリア画面？
	          if(count > 120){   
              	game.rootScene.addChild(back);
		            game.clear(game.score,"あなたの回避率は"+ game.score +"％です！");
            }
	      });
        var pad = new Pad();
        pad.x = 0;
        pad.y = 224;
        game.rootScene.addChild(pad);
    });
    game.start();
});
// 敵クラスの動作を決めるひな形
var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, game, setImage, flag){
        enchant.Sprite.call(this, x, y);
        this.width = x;
        this.height = y;
        this.image = game.assets[setImage];

        this.addEventListener('enterframe', function(e) {
            if(this.within(player,15)){       
                game.rootScene.removeChild(Enemy);
	              player.frame = 3;
                game.overFlag = true;
	              game.end(game.score,"あなたの回避率は"+ game.score +"％です！");
	          }else if(this.y > game.height || this.y < 0 || this.x > game.width || this.x < 0){
	              game.rootScene.removeChild(this);
            }else{
                if(setImage == "./img/enemy.png"){
                    flag ? this.y += 3 : this.y -= 3;
                }else{
                    flag ? this.x += 3 : this.x -= 3;
                }
	          }
        });
        game.rootScene.addChild(this);
    }
});
var Enemiku = enchant.Class.create(Enemy, {
    initialize: function(game, flag){
        Enemy.call(this, 12, 12, game, './img/enemy.png', flag);
        this.x = rand(304);
        flag ? this.y = 0 : this.y = game.height;
    }
});
var Enegi = enchant.Class.create(Enemy, {
    initialize: function(game, flag){
        Enemy.call(this, 16, 16, game, './img/negi.png', flag);
        flag ? this.x = 0 : this.x = game.width;
        this.y = rand(304);
    }
});

function rand(num){
    return Math.floor(Math.random() * num);
};
