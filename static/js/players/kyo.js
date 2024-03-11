import { Player } from "../players/base.js";
import { GIF } from "../utils/gif.js";

export class Kyo extends Player{
constructor(root,info){
    super(root,info)
    this.init_animations()
}

init_animations(){
    let outer = this
    let offsets = [0,-22,-22,-140,0,0,0]
for(let i =0;i<7;i++){
    let gif = GIF()
    gif.load(`./static/images/players/kyo/${i}.gif`)
    this.animations.set(i,{
        gif: gif,
        frame_cnt:0,  //当前帧数 总图片数
        frame_rate: 5, //帧率 , 每5帧过渡一次
        offset_y: offsets[i], //y轴偏移 
        loaded: false, //是否加载完成
        scale: 2, //缩放

    })
    gif.onload = function(){
        let obj = outer.animations.get(i)
        obj.frame_cnt = gif.frames.length
        obj.loaded = true
        if(i===3){//调节跳跃时候的帧率渲染,完善游戏画面
            obj.frame_rate=5
        }
    }
}
}
}