let GAME_OBJECTS =[];

class GameObject{
    constructor(){
    GAME_OBJECTS.push(this);
    this.timedelta = 0;//存储当前时间距离上一帧数的时间
    this.has_call_start = false;//是否已经调用了start方法
    }

    start(){//初始帧数

    }

    update(){//每一帧执行一次

    }

    destroy(){//删除当前元素
        for (let i in GAME_OBJECTS){
            if(GAME_OBJECTS[i] === this){//判别是3个等号
                GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
}

let last_timestamp //存储上一帧的时间戳
let GAME_OBJECTS_Frame = (tiemstamp) =>{
    for(let obj of GAME_OBJECTS){
        if(!obj.has_call_start){
            obj.start()
            obj.has_call_start = true
        }else{
            obj.timedelta = tiemstamp - last_timestamp
            obj.update()
        }
    }
    last_timestamp = tiemstamp
    requestAnimationFrame(GAME_OBJECTS_Frame)
}

requestAnimationFrame(GAME_OBJECTS_Frame)

export{
    GameObject
}