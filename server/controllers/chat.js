module.exports = {
  getUserChatList: (req, res) => {
    /*
      userId로 유저가 참여중인 게더링 id 들을 
      몽구스chat 스키마에서 최근 메시지1개를 현재 날짜와 비교 (오늘: 12:12, 어제: 어제, 그 이후는 날짜로 보내주기)
    */
  },
  joinChatingRoom: (req, res) => {
    // 채팅 로그들, 참여자 목록(id, image,nickname),  더링 정보(이모지,스포츠. 타이틀)
  },
  leaveChatingRoom: (req, res) => {
    //방에서 나감, mysql => 삭제
  },
};
