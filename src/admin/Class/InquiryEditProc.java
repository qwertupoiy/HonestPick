package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import mypage.dao.MypageDAO;
import mypage.dto.InquiryDTO;

public class InquiryEditProc implements AdminCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
    	int InquiryNo = Integer.parseInt(request.getParameter("InquiryNo"));
		
		// MemberNo check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (sessMemberNo != MemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}

		String InquiryType = request.getParameter("InquiryType");
		String InquiryContent = request.getParameter("InquiryContent");
    	
		InquiryDTO dtoAg = new InquiryDTO();
		dtoAg.setMemberNo(MemberNo);
		dtoAg.setInquiryNo(InquiryNo);
		dtoAg.setInquiryType(InquiryType);
		dtoAg.setInquiryContent(InquiryContent);
		
		MypageDAO dao = new MypageDAO();
		int result = dao.setUpdate(dtoAg);
		
		if (result > 0) {
            System.out.println("InquiryEdit success");
            session.setAttribute("alertMsg", "문의 수정에 성공하였습니다.");
            response.sendRedirect(path + "/Mypage_servlet/inquiryList.do?MemberNo=" + MemberNo);
        } else {
            System.out.println("InquiryEdit fail");
            session.setAttribute("alertMsg", "문의 수정에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/inquiryEdit.do?InquiryNo=" + InquiryNo + "&MemberNo=" + MemberNo);
        }
    }
}