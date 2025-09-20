package member.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import member.dao.MemberDAO;
import member.dto.MemberDTO;

public class Join {
    public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/member/join.jsp");
        rd.forward(request, response);
    }

    public void processProc(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		int max_upload = 10 * 1024 * 1024; // 10MB까지
		
		//multi 객체(경로) 생성
		MultipartRequest multi = new MultipartRequest(
			request,
			uploadPath,
			max_upload,
			"utf-8",
			new DefaultFileRenamePolicy()
		);
    	
		String attachInfo = "";
		String fileOrgName = multi.getOriginalFileName("MemberImage");
		String fileName = multi.getFilesystemName("MemberImage");
		
    	if(fileOrgName == null) {
    		attachInfo = "-";
    	} else {
    		attachInfo += fileOrgName;
    		attachInfo += "|";
    		attachInfo += fileName;
    	}
		
        String MemberId = multi.getParameter("MemberId");
        String MemberPwd = multi.getParameter("MemberPwd");
        String MemberNickname = multi.getParameter("MemberNickname");
        String MemberName = multi.getParameter("MemberName");
        String PhoneNumber = multi.getParameter("PhoneNumber");
        String MemberEmail = multi.getParameter("MemberEmail");
        String MemberPostalCode = multi.getParameter("MemberPostalCode");
        String MemberAddr = multi.getParameter("MemberAddr");
        String MemberStreetAddr = multi.getParameter("MemberStreetAddr");
        String MemberAdditionalInfo = multi.getParameter("MemberAdditionalInfo");
        String Admin_ = multi.getParameter("Admin");

        // MemberName이 null이거나 빈 값일 경우 에러 처리
        if (MemberName == null || MemberName.trim().isEmpty()) {
            request.setAttribute("errorMessage", "회원 이름을 입력해주세요.");
            RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/member/join.jsp");
            rd.forward(request, response);
            return;
        }

        int Admin = 0;
        if (Admin_ != null && Admin_.equals("normal")) {
            Admin = 0;
        } else if (Admin_ != null && Admin_.equals("owner")) {
            Admin = 1;
        } else {
        	Admin = 2;
        }

        // MemberDTO 객체 생성 및 값 설정
        MemberDTO dtoag = new MemberDTO();
        dtoag.setMemberImage(attachInfo);
        dtoag.setMemberName(MemberName);
        dtoag.setMemberId(MemberId);
        dtoag.setMemberPwd(MemberPwd);
        dtoag.setPhoneNumber(PhoneNumber);
        dtoag.setMemberEmail(MemberEmail);
        dtoag.setMemberNickname(MemberNickname);
        dtoag.setAdmin(Admin);
        dtoag.setMemberPostalCode(MemberPostalCode);
        dtoag.setMemberAddr(MemberAddr);
        dtoag.setMemberStreetAddr(MemberStreetAddr);
        dtoag.setMemberAdditionalInfo(MemberAdditionalInfo);

        // DB에 회원 정보 저장
        MemberDAO dao = new MemberDAO();
        int result = dao.setInsert(dtoag);

        HttpSession session = request.getSession();
        // 결과 처리
        if (result > 0) {
            System.out.println("Join success");
            session.setAttribute("alertMsg", "회원가입이 완료되었습니다.");
            response.sendRedirect(path + "/Member_servlet/login.do");
        } else {
            System.out.println("Join fail");
            session.setAttribute("alertMsg", "회원가입에 실패하였습니다.");
            response.sendRedirect(path + "/Member_servlet/join.do");
        }
    }
    
    public void id_check(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String memberId = request.getParameter("userId");
    	MemberDAO dao = new MemberDAO();
    	boolean exists = dao.isMemberIdExists(memberId);
    	
    	response.setContentType("application/json; charset=UTF-8");
    	response.getWriter().write("{\"available\": " + (!exists) + "}");
    	return;
    }
    
    public void nick_check(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String memberNickname = request.getParameter("userNick");
    	MemberDAO dao = new MemberDAO();
    	boolean exists = dao.isMemberNickExists(memberNickname);
    	
    	response.setContentType("application/json; charset=UTF-8");
    	response.getWriter().write("{\"available\": " + (!exists) + "}");
    	return;
    }
}
