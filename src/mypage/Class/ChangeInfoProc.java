package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import member.dao.MemberDAO;
import member.dto.MemberDTO;
import mypage.controller.MypageCommand;

public class ChangeInfoProc implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		int max_upload = 10 * 1024 * 1024; // 10MB까지
		
		MultipartRequest multi = new MultipartRequest(
			request,
			uploadPath,
			max_upload,
			"utf-8",
			new DefaultFileRenamePolicy()
		);
		
		String MemberNo_ = multi.getParameter("MemberNo");
		int MemberNo = Integer.parseInt(MemberNo_);
		String fileOrgName = multi.getOriginalFileName("MemberImage");
		String fileName = multi.getFilesystemName("MemberImage");
		String MemberImage;
		if (fileOrgName == null || fileName == null) {
			MemberImage = "-";
		} else {
			MemberImage = fileOrgName + "|" + fileName;
		}
		
        String MemberPwd = multi.getParameter("MemberPwd");
        String MemberNickname = multi.getParameter("MemberNickname");
        String currentPassword = multi.getParameter("currentPassword");
        String newPassword = multi.getParameter("newPassword");
        String confirmPassword = multi.getParameter("confirmPassword");
        /*
	        if(!newPassword.equals(confirmPassword)) {
	        	System.out.println("password is not equal");
	        	response.sendRedirect(path + "/Mypage_servlet/changeInfo.do?MemberNo=" + MemberNo);
	        }
		*/
        String PhoneNumber = multi.getParameter("phoneNumber");
        String MemberEmail = multi.getParameter("MemberEmail");
        String MemberPostalCode = multi.getParameter("MemberPostalCode");
        String MemberAddr = multi.getParameter("MemberAddr");
        String MemberStreetAddr = multi.getParameter("MemberStreetAddr");
        String MemberAdditionalInfo = multi.getParameter("MemberAdditionalInfo");
        
        /* MemberName이 null이거나 빈 값일 경우 에러 처리
        if (MemberName == null || MemberName.trim().isEmpty()) {
            request.setAttribute("errorMessage", "회원 이름을 입력해주세요.");
            RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/member/join.jsp");
            rd.forward(request, response);
            return;
        }
        */
    	System.out.println("MemberNo : " + MemberNo);
    	System.out.println("MemberNickname : " + MemberNickname);
    	System.out.println("MemberEmail : " + MemberEmail);
    	System.out.println("PhoneNumber : " + PhoneNumber);
    	
        
        
    	// MemberDTO 객체 생성 및 값 설정
        MemberDTO dtoAg = new MemberDTO();
        dtoAg.setMemberImage(MemberImage);
        dtoAg.setMemberNo(MemberNo);
        dtoAg.setMemberPwd(currentPassword);
        dtoAg.setMemberChangePwd(newPassword);
        dtoAg.setPhoneNumber(PhoneNumber);
        dtoAg.setMemberEmail(MemberEmail);
        dtoAg.setMemberNickname(MemberNickname);
        dtoAg.setMemberPostalCode(MemberPostalCode);
        dtoAg.setMemberAddr(MemberAddr);
        dtoAg.setMemberStreetAddr(MemberStreetAddr);
        dtoAg.setMemberAdditionalInfo(MemberAdditionalInfo);
        
        MemberDAO dao = new MemberDAO();

        // If before_attachInfo is not existed
        if (fileOrgName == null || fileName == null) {
        	dtoAg.setMemberImage(dao.getSelectOne(dtoAg).getMemberImage());
        } else {
        	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getMemberImage().split("[|]")[1]);
        	if(deleteFile.exists()) {
        		deleteFile.delete();
        		System.out.println("fileDelete Success");
        		dtoAg.setMemberImage(MemberImage);
        	} else {
        		System.out.println("fileDelete Fail");
        		return;
        	}
        }

        // DB에 회원 정보 저장
        int result = dao.setUpdate(dtoAg);
        
        // 결과 처리
        HttpSession session = request.getSession();
        int sessAdmin = (int) session.getAttribute("Admin");
		if(sessAdmin < 2) {
			if (result > 0) {
	            System.out.println("myInfo_change_success");
	            session.setAttribute("alertMsg", "회원 정보수정이 완료되었습니다.");
	            response.sendRedirect(path + "/Mypage_servlet/changeInfo.do?MemberNo=" + MemberNo);
	        } else {
	            System.out.println("myInfo_change_fail");
	            session.setAttribute("alertMsg", "회원 정보수정에 실패하였습니다.");
	            response.sendRedirect(path + "/Mypage_servlet/changeInfo.do?MemberNo=" + MemberNo);
	        }
		} else if(sessAdmin == 2){ 
			if (result > 0) {
	            System.out.println("Admin_memberInfo_success");
	            session.setAttribute("alertMsg", "회원 정보수정이 완료되었습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_member.do");
	        } else {
	            System.out.println("Admin_memberInfo_fail");
	            session.setAttribute("alertMsg", "회원 정보수정에 실패하였습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_member.do");
	        }
		}
    }
}