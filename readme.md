
## Introduction 
This Porject implements a visualization of Knowledge Graph on COVID-19 using Neo4j and Node.js by Wei JIANG, Yijun LU and Zijie LIU

## Visulization Page

## Dependencies
* [Node4j](https://https://neo4j.com/) >= 4.0.11
* [JAVA](https://www.java.com) >= 11

```sh
npm install
npm install webpack
```

## Running the Demo
```sh
neo4j console
npm start
```
go to localhost：8080/visualization and this page would appear 







neo4j 版本要求：4.0.11 + java 11，安装完成后在环境变量修改路径

1. 修改neo4j文件夹下的conf文件的neo4j.conf，修改dbms.security.auth_enabled=false；
2. 安装node.js
3. 在webpack.config修改database的名称，用户名和密码
4. 在neo4j文件夹下的bin 运行cmd，输入neo4j console)
5. 在文件“front-end”运行cmd，依次输入npm install 和 npm install webpack
6. npm start

在浏览器中打开localhost：8080/visualization进入主页
