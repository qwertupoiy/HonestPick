package mypage.Class;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.InquiryDTO;

public class InquiryList implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		// MemberNo check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (sessMemberNo != MemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
    	
		InquiryDTO dtoAg = new InquiryDTO();
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		List<InquiryDTO> listInquiry = dao.getSelectAllInquiry(dtoAg);
		
		for (int i = 0; i < listInquiry.size(); i++) {
			if (listInquiry.get(i).getInquiryType().equals("예약")) {listInquiry.get(i).setInquiryType("예약 관련 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("음식점")) {listInquiry.get(i).setInquiryType("음식점 정보 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("리뷰")) {listInquiry.get(i).setInquiryType("리뷰 관련 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("점주")) {listInquiry.get(i).setInquiryType("점주 서비스 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("결제")) {listInquiry.get(i).setInquiryType("결제 관련 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("계정")) {listInquiry.get(i).setInquiryType("계정/로그인 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("기술")) {listInquiry.get(i).setInquiryType("기술적 오류 신고");}
			else if (listInquiry.get(i).getInquiryType().equals("편의")) {listInquiry.get(i).setInquiryType("불만/신고 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("제휴")) {listInquiry.get(i).setInquiryType("제휴 문의");}
			else if (listInquiry.get(i).getInquiryType().equals("기타")) {listInquiry.get(i).setInquiryType("기타 문의");}
		}
		
		request.setAttribute("listInquiry", listInquiry);
		
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/inquiryList.jsp");
        rd.forward(request, response);
    }
}