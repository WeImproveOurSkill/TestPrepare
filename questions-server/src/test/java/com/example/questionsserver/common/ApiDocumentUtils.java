package com.example.questionsserver.common;

import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;

/**
 * REST Docs 문서화를 위한 공통 유틸리티 클래스
 */
public class ApiDocumentUtils {
    
    /**
     * 요청 데이터를 읽기 쉽게 포맷팅하여 반환
     * @return OperationRequestPreprocessor
     */
    public static org.springframework.restdocs.operation.preprocess.OperationRequestPreprocessor getDocumentRequest() {
        return preprocessRequest(
                modifyUris()
                        .scheme("https")
                        .host("docs.api.com")
                        .removePort(),
                prettyPrint()
        );
    }
    
    /**
     * 응답 데이터를 읽기 쉽게 포맷팅하여 반환
     * @return OperationResponsePreprocessor
     */
    public static org.springframework.restdocs.operation.preprocess.OperationResponsePreprocessor getDocumentResponse() {
        return preprocessResponse(prettyPrint());
    }
}