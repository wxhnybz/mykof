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

        this.status = 3 //状态机 0:idle原地不动 , (1: 向前 2: 向后 1 :移动)3:跳跃 4:攻击 5:被攻击 6:死亡
        this.animations = new Map()

        this.pressed_keys = this.root.game_map.controller.pressed_keys

        this.frame_current_cnt = 0

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
            if(w){
                if(d){
                    this.vx = this.speed;
                }else if(a){
                    this.vx = -this.speed;
                }else{
                    this.vx = 0;
                }
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
        if(this.status==3){
            this.vy += this.gravity
        }
        this.x += this.vx * this.timedelta/1000
        this.y += this.vy* this.timedelta/1000

        if(this.y>450){
            this.y = 450
            this.vy = 0
            this.status = 0
        }
        if(this.x<0){
            this.x = 0
        }else if(this.x +this.width > this.root.game_map.$canvas.width()){
            this.x = this.root.game_map.$canvas.width() - this.width
        }
    }

    update(){
        this.update_control()
        this.update_move()
        this.render()
    }

    render(){
        // this.ctx.fillStyle = this.color
        // this.ctx.fillRect(this.x,this.y,this.width,this.height)
        let status = this.status
        //区分前进和后退
        if(this.status===1&&this.direction*this.vx<0){
            status = 2
        }

        let obj = this.animations.get(status)
        if(obj&&obj.loaded){
            let k = parseInt(this.frame_current_cnt /obj.frame_rate)% obj.frame_cnt
            let image = obj.gif.frames[k].image
            this.ctx.drawImage(image,this.x,this.y+obj.offset_y,image.width*obj.scale,image.height*obj.scale)
        }
        this.frame_current_cnt++

    }
}