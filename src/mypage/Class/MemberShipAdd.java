package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.MemberShipDTO;

public class MemberShipAdd implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		// 세션에서 값 가져오기
		HttpSession session = request.getSession();
		MemberShipDTO dto = (MemberShipDTO) session.getAttribute("dtoAg");
        int MemberNo = (int) session.getAttribute("MemberNo");
        //String paymentResult = (String) session.getAttribute("paymentResult");
		
        MypageDAO dao = new MypageDAO();
        int result = dao.setUpdateMemberShip(dto);
        
        if (result > 0) {
            System.out.println("success");
            session.setAttribute("alertMsg", "멤버십 구매 완료되었습니다.");
            response.sendRedirect(path + "/Mypage_servlet/storeList.do?MemberNo=" + MemberNo);
        } else {
            System.out.println("fail");
            session.setAttribute("alertMsg", "멤버십 구매에 실패하였습니다.");
            response.sendRedirect(path + "/Mypage_servlet/storeList.do?MemberNo=" + MemberNo);
        }
    }
}