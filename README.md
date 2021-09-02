      <!-- 在 vant 组件中，凡是有 icon 属性的，都可以使用Vant自己的内置图标 -->
      <van-button icon="chat" type="primary" />
      <!-- 在 Vant 组件中使用我们自己的图标。通过 icon-prefix 告诉 Vant 我们的图标类名前缀叫toutiao。然后告诉vant我们icon具体的名chat。Vant 会帮助我们生成字体图标 -->
      <van-button
        icon-prefix="toutiao"
        icon="yanzhengma"
        type="primary"
      ></van-button>

## 1.项目初始化

使用cli创建项目

加入 Git 版本管理

初始目录结构

调整目录结构

关于移动端组件库

导入 Vant 组件库

移动端 REM 适配 
- postcss-pxtorem 是一款postcss插件，用于将px单位转为rem
- lib-flexible 用于设置 rem 基准值

关于PostCSS配置文件



注意：登录状态下数据持久化添加频道有问题 p95-p98


    JS 能够表示的整数返回在 -2^53 到 2^53 次方之间。超过这个范围，无法精确表示这个值。
    此时需要用到 json.bigint 将后端返回数据处理之后才可以正常使用。
        npm i json-bigint
        import JSONbig form 'json-bigint'
        transformResponse是将后端返回的原始数据进行处理。
        使用 try-catch 来捕获异常