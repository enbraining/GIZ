export default function roles(){
    const allGrade = [
        process.env.FIRST_GRADE ?? '',
        process.env.SECOND_GRADE ?? '',
        process.env.THIRD_GRADE ?? '',
      ]

      const firstGradeClass = [
        process.env.ONE_ONE ?? '',
        process.env.ONE_TWO ?? '',
        process.env.ONE_THREE ?? '',
        process.env.ONE_FOUR ?? '',
      ]

      const secondGradeClass = [
        process.env.TWO_ONE ?? '',
        process.env.TWO_TWO ?? '',
        process.env.TWO_THREE ?? '',
        process.env.TWO_FOUR ?? '',
      ]

      const thirdGradeClass = [
        process.env.THREE_ONE ?? '',
        process.env.THREE_TWO ?? '',
        process.env.THREE_THREE ?? '',
        process.env.THREE_FOUR ?? '',
      ]

    return {
        grades: allGrade,
        classes: [
            firstGradeClass,
            secondGradeClass,
            thirdGradeClass
        ]
    }
}
