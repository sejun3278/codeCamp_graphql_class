import { createConnection } from "typeorm";
import { ApolloServer, gql } from 'apollo-server'
import Board from "./Board.postgres";
import { IResolvers } from "@graphql-tools/utils";

// 타입 설정

// 해당 API (인자값) : 결과 타입
const typeDefs = gql`
    type Board {
        number : Int
        writer : String
        title : String
        age : Int
    }

    type Query {
        fetchBoards: [Board]
        fetchBoard(number : Int!) : Board
    }

    input UpdateBoardInput {
        title : String
        age : Int
    }

    type Mutation {
        createBoard(writer : String!, title : String!, age : Int!) : Boolean
        updateBoard(number : Int!, updateBoardInput : UpdateBoardInput!) : Boolean
        deleteBoard(number : Int!) : Boolean
    }

    # 백틱에서는 샵을 붙여야 주석이 된다.
`

// API
const resolvers : IResolvers = {
    Query : {
        fetchBoards : () => {
            // 데이터 조회 후, 프론트엔드로 전달

            const boardInfo = Board.find({
                where : { deletedAt : null }
            });

            return boardInfo
            // 리턴 되는 부분이 실제로 프론트엔드로 전달되는 부분
        },

        fetchBoard : (_, agrs) => {
            const boardInfo = Board.findOne({
                where : { number : agrs.number, deletedAt : null }
            })

            return boardInfo
        }
    },

    Mutation : {
        // args 로 데이터를 받아올 수 있다.

        createBoard : async (_, args) => {
            // 데이터 생성 후, 프론트엔드로 전달

            try { 
                await Board.insert({
                    writer : args.writer,
                    title : args.title,
                    age : args.age
                })
                return true

            } catch(err) {
                console.log(err.message)
                return false;
            }
        },

        updateBoard : async (_, args) => {
            
            try {
                await Board.update({ number : args.number }, // 조건
                {
                    title : args.updateBoardInput.title,
                    age : args.updateBoardInput.age
                }) // 바꿀 내용
                return true;

            } catch(err) {
                console.log(err.message)
                return false;
            }
        },

        deleteBoard : async (_, args) => {
            
            try {
                await Board.update({ number : args.number }, {
                    deletedAt : new Date()
                })
                // await Board.delete({ number : args.number })
                return true;

            } catch(err) {
                console.log(err.message)
                return false;
            }
        }
    }
}

// 아폴로 서버를 생성한다.
const server = new ApolloServer({
    typeDefs : typeDefs, // 타입 입력
    resolvers : resolvers, // API 입력
})


// typeorm 과 데이터베이스를 연결한다.
createConnection({
    // 데이터베이스의 정보를 입력
    type : "postgres",
    database : 'postgres',
    username : "postgres",
    password : 'postgres2021',
    port : 5013,
    host : '34.64.71.71', // 'db.example.codebootcamp.co.kr'
    entities : [__dirname + '/*.postgres.ts'], // 현재 위치에서 postgres.js 로 끝나는 파일은 테이블로 한다.
    logging : true,
    synchronize : true, // SQL 쿼리 실행 내역을 보여준다.

}).then( () => {
    // 연결 성공시 실행
    server.listen({
        port : 4000
    })
    console.log('서버 접속 완료')

}).catch( (err) => {
    // 연결 실패시 실행
    console.log(err)
})