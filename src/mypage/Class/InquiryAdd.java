package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.InquiryDTO;

public class InquiryAdd implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		String InquiryType = request.getParameter("InquiryType");
		String InquiryContent = request.getParameter("InquiryContent");
		
		HttpSession session = request.getSession();
		int MemberNo = (int) session.getAttribute("MemberNo");
		
		InquiryDTO dtoag = new InquiryDTO();
		dtoag.setInquiryType(InquiryType);
		dtoag.setInquiryContent(InquiryContent);
		dtoag.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		int result = dao.setInsert(dtoag);
		
        if (result > 0) {
            System.out.println("Inquiry success");
            session.setAttribute("alertMsg", "문의 작성 완료되었습니다.");
            response.sendRedirect(path + "/Home_servlet/home.do");
        } else {
            System.out.println("Inquiry fail");
            session.setAttribute("alertMsg", "문의 작성 실패하였습니다.");
            response.sendRedirect(path + "/Home_servlet/home.do");
        }
    }
}
