import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
// BaseEntity : 테이블을 만들기 위한 기능을 가지고 있음

// 테이블 만들기
@Entity()
export default class Board extends BaseEntity {
    @PrimaryGeneratedColumn("increment") // 자동으로 1씩 증가하는 ID 생성
    number!: number;

    @Column({ type : "text" }) // 데이터베이스에 실제로 적용되는 타입
    writer! : string; // 타입 스크립트 타입

    @Column({ type : "text" })
    title!: string;

    @Column({ type : "integer" })
    age!: number;

    @Column({ type : "timestamp", default : null, nullable : true })
    // 기본 값이 null 이고, nullable 로 null 값을 넣을 수 있는지를 표시
    deletedAt? : Date
}