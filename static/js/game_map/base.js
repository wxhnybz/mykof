import {GameObject} from '../game_object/base.js'
import { Controller } from '../controller/base.js'

let ALL_TIME = 60000
// 地图初始化的时候需要先画一个canvas
export class GameMap extends GameObject{
    constructor(root){
        super()
        this.root = root
        this.$canvas = $('<canvas width="1280" height="720" tabindex = 0></canvas>')
        this.ctx = this.$canvas[0].getContext('2d')
        this.root.$kof.append(this.$canvas)
        this.$canvas.focus()

        this.controller = new Controller(this.$canvas)

        this.root.$kof.append(` <div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`)
        this.time_left = ALL_TIME
        this.$timer = this.root.$kof.find(".kof-head-timer")
    }
    start(){
        
    }
    update()
    {   
        this.time_left -= this.timedelta
        if(this.time_left<0){
            let [a,b] = this.root.players
            if(a.status!==6&&b.status!==6){
            if(a.hp===b.hp){

            }else if(a.hp>b.hp){
                b.status = 6
                b.frame_current_cnt = 0
                b.vx = 0
            }else{
                a.status = 6
                a.frame_current_cnt = 0
                a.vx = 0
            }
        }


        }
        if(this.time_left<0)this.time_left = 0
        this.$timer.text(parseInt(this.time_left/1000))
        this.render()
    }
    render(){
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)
        // console.log(this.ctx.canvas.width,this.ctx.canvas.height)
        // this.ctx.fillStyle = 'black'
        // this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)

    }
}  