import { GameObject } from "../game_object/base.js";
// 有状态机进行定义角色的所有状态
export class Player extends GameObject{
    constructor(root,info){
        super()
        this.root = root
        this.id = info.id
        // 位置
        this.x = info.x
        this.y = info.y
        this.width = info.width
        this.height = info.height
        this.color = info.color
        // 方向
        this.direction = 1 //1表示向右，-1表示向左
        // 速度
        this.vx = 0
        this.vy = 0

        this.speed = 400 //移动速度
        this.jump_speed = -1200  //跳跃初始速度

        this.gravity = 50 //重力

        this.ctx = this.root.game_map.ctx

        this.status = 0//状态机 0:idle原地不动 , (1: 向前 2: 向后 1 :移动)3:跳跃 4:攻击 5:被攻击 6:死亡
        this.animations = new Map()

        this.pressed_keys = this.root.game_map.controller.pressed_keys

        this.frame_current_cnt = 0


        //血量
        this.hp = 100
//学一下这个写法
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`)
        this.$hp_div = this.$hp.find('div')

    }

    start(){

    }

    update_control(){
        let w,a,d,j
        if(this.id ===0){//玩家一
            w = this.pressed_keys.has('w')
            a = this.pressed_keys.has('a')
            d = this.pressed_keys.has('d')
            j = this.pressed_keys.has('j')
        }else{//玩家二
            w = this.pressed_keys.has('ArrowUp')
            a = this.pressed_keys.has('ArrowLeft')
            d = this.pressed_keys.has('ArrowRight')
            j = this.pressed_keys.has('ArrowDown')
        }

        if(this.status === 0 || this.status === 1){
            if(j){
                this.status= 4
                this.vx = 0
                this.frame_current_cnt = 0
            }
            else if(w){
                if(d){
                    this.vx = this.speed;
                }else if(a){
                    this.vx = -this.speed;
                }
                else{
                    this.vx = 0;
                }
                this.frame_current_cnt = 0
                this.vy = this.jump_speed
                this.status = 3
            }
            else if(d){
                this.vx = this.speed
                this.status = 1
            }
            else if(a){
                this.vx = -this.speed
                this.status = 1
            }else{
                this.vx = 0
                this.status = 0
            }
        }
    }

    update_move(){
            this.vy += this.gravity
        this.x += this.vx * this.timedelta/1000
        this.y += this.vy* this.timedelta/1000
//玩家碰撞检测
        // let [a,b] = this.root.players
        // if(a!==this) [a,b] = [b,a]
        // let r1 = {
        //     x1: a.x,
        //     y1:a.y,
        //     x2: a.x+a.width,
        //     y2:a.y+a.height
        // }
        // let r2 = {
        //     x1: b.x,
        //     y1:b.y,
        //     x2: b.x+b.width,
        //     y2:b.y+b.height
        // }

        // if(this.is_collision(r1,r2)){
        //     b.x+=this.vx*this.timedelta/1000 /2
        //     b.y+= this.vy*this.timedelta/1000
        //     a.x-= this.vx*this.timedelta/1000 /2
        //     a.y+=this.vy*this.timedelta/1000 

        //     if(this.status === 3){
        //         this.status = 0
        //     }
        // }

        if(this.y>450){
            this.y = 450
            this.vy = 0
            if(this.status === 3)
            this.status = 0
        }
        if(this.x<0){
            this.x = 0
        }else if(this.x +this.width > this.root.game_map.$canvas.width()){
            this.x = this.root.game_map.$canvas.width() - this.width
        }
    }


    update_direction(){
        //特判,牢牢记住,****
        if(this.status === 6)
        return

        let players = this.root.players
        if(players[0]&&players[1]){
            let me = this , you = players[1-this.id]
            if(me.x<you.x) me.direction =1
            else me.direction =-1
        }
    }


// 攻击函数
    updata_attack(){
        if(this.status === 4&&this.frame_current_cnt===18){
            // this.status=0;
            let me = this,you = this.root.players[1-this.id];
            let r1 ;//攻击范围
            if(this.direction>0){//赋值对象
                r1 ={
                x1: me.x+120,
                y1: me.y+40,
                x2:me.x+120+100,
                y2:me.y+40+20}
                }else{
                r1={
                x1: me.x+me.width-120-100,
                y1: me.y+40,
                x2: me.x+me.width-120-100+100,
                y2: me.y+40+20
                }
            }

            let r2//收到攻击范围
            r2 ={
                x1: you.x,
                y1: you.y,
                x2: you.x+you.width,
                y2: you.y+you.height
            }
            if(this.is_collision(r1,r2)){
                you.is_attack()
            }
        }
    }

//碰撞检测
// 水平方向和竖直方向都有交集
// max(a,c)<min(b,d)
    is_collision(r1,r2){
        if(Math.max(r1.x1,r2.x1)>Math.min(r1.x2,r2.x2))
        return false
        if(Math.max(r1.y1,r2.y1)>Math.min(r1.y2,r2.y2))
        return false

        return true //碰撞了
    }

    is_attack(){
        //特判,牢牢记住,****
        if(this.status===6){
            return
        }

        this.status = 5
        this.frame_current_cnt = 0
        this.hp = Math.max(this.hp-10,0)

        // 血条的渐变效果
        this.$hp.animate({
            width:this.$hp.parent().width()*this.hp/100
        },600)
        this.$hp_div.animate({
            width:this.$hp.parent().width()*this.hp/100
        },300)
        // this.$hp.width(this.$hp.parent().width()*this.hp /100 )

        if(this.hp<=0){
            this.status = 6
            this.frame_current_cnt = 0
            this.vx = 0
        }
    }
    update(){
        this.update_control()
        this.update_move()
        this.update_direction()
        this.updata_attack()
        this.render()
    }

    render(){

        this.ctx.fillStyle = 'blue'
        this.ctx.fillRect(this.x,this.y,this.width,this.height);
        if(this.direction>0){
        this.ctx.fillStyle = 'red'
        this.ctx.fillRect(this.x+120,this.y+35,100,20)}
        else{
            this.ctx.fillStyle = 'red'
            this.ctx.fillRect(this.x-200+this.width-20,this.y+35,100,20)}
        

        // this.ctx.fillStyle = this.color
        // this.ctx.fillRect(this.x,this.y,this.width,this.height)
        let status = this.status
        //区分前进和后退
        if(this.status===1&&this.direction*this.vx<0){
            status = 2
        }

        let obj = this.animations.get(status)
        if(obj&&obj.loaded){

            if(this.direction>0)
        {
            let k = parseInt(this.frame_current_cnt /obj.frame_rate)% obj.frame_cnt
            let image = obj.gif.frames[k].image
            this.ctx.drawImage(image,this.x,this.y+obj.offset_y,image.width*obj.scale,image.height*obj.scale)
        }    else{
            this.ctx.save()
            this.ctx.scale(-1,1)
            this.ctx.translate(-this.root.game_map.$canvas.width(),0)
            let k = parseInt(this.frame_current_cnt /obj.frame_rate)% obj.frame_cnt
            let image = obj.gif.frames[k].image
            this.ctx.drawImage(image,this.root.game_map.$canvas.width()-this.x-this.width,this.y+obj.offset_y,image.width*obj.scale,image.height*obj.scale)
            this.ctx.restore()
        }
        }
        if(status ===4 && this.frame_current_cnt===obj.frame_rate*obj.frame_cnt-1){//减少一帧,从0开始,减少卡帧
            this.status = 0
        }
        if(status===5&& this.frame_current_cnt===obj.frame_rate*obj.frame_cnt-1){
            this.status = 0
        }

        if(status===6 && this.frame_current_cnt===obj.frame_rate*obj.frame_cnt-1){
            this.frame_current_cnt--
        }
        this.frame_current_cnt++

    }
}