package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import mypage.dao.MypageDAO;
import mypage.dto.InquiryDTO;

public class InquiryEdit implements AdminCommand {
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
    	
		InquiryDTO dtoAg = new InquiryDTO();
		dtoAg.setMemberNo(MemberNo);
		dtoAg.setInquiryNo(InquiryNo);
		
		MypageDAO dao = new MypageDAO();
		InquiryDTO dtoInquiry = dao.getSelectOne(dtoAg);
		
		request.setAttribute("dtoInquiry", dtoInquiry);
		
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/inquiryEdit.jsp");
        rd.forward(request, response);
    }
}